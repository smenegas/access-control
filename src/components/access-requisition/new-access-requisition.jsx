import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../helpers/authentication';
import { getFolders } from '../../helpers/folders/network-folders';
import { LoadMenuTree } from '../../helpers/system-menu/system-menu';
import Header from '../common/header';
import './new-access-requisition.css';

function getCollection(data) {
	if (Array.isArray(data)) return data;
	return data?.Rows || data?.rows || data?.data || data?.items || [];
}

function getItemId(item) {
	return item?.id ?? item?.ID ?? item?.folder_id ?? item?.menu_id;
}

function getItemName(item) {
	return item?.name ?? item?.folder_name ?? item?.menu_name ?? item?.description ?? 'Item sem nome';
}

function MenuOption({ menu, selectedMenus, onToggle }) {
	const menuId = getItemId(menu);
	const children = menu?.childrens || menu?.children || [];

	return (
		<div className="requisicao-menu-item">
			<label className="requisicao-check-option">
				<input
					type="checkbox"
					checked={selectedMenus.includes(menuId)}
					onChange={() => onToggle(menuId)}
				/>
				<span>{getItemName(menu)}</span>
			</label>
			{children.length > 0 && (
				<div className="requisicao-menu-children">
					{children.map((child) => (
						<MenuOption
							key={getItemId(child)}
							menu={child}
							selectedMenus={selectedMenus}
							onToggle={onToggle}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default function NewAccessRequisition({ aoVoltarDashboard, aoEnviarSolicitacao }) {
	const navigate = useNavigate();
	const user = getUser() || {};
	const [formData, setFormData] = useState({
		name: user.name || '',
		email: user.email || '',
		position: '',
		registration: '',
		cpf: '',
		employmentType: '',
		justification: ''
	});
	const [menuTree, setMenuTree] = useState([]);
	const [folders, setFolders] = useState([]);
	const [selectedMenus, setSelectedMenus] = useState([]);
	const [selectedFolders, setSelectedFolders] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [loadingOptions, setLoadingOptions] = useState(true);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });

	useEffect(() => {
		let mounted = true;

		const loadOptions = async () => {
			try {
				const [menusResponse, foldersResponse] = await Promise.all([
					LoadMenuTree(),
					getFolders()
				]);

				if (mounted) {
					setMenuTree(getCollection(menusResponse));
					setFolders(getCollection(foldersResponse));
				}
			} catch (error) {
				if (mounted) {
					setMessage({
						text: error.message || 'Não foi possível carregar as opções de acesso.',
						type: 'erro'
					});
				}
			} finally {
				if (mounted) setLoadingOptions(false);
			}
		};

		loadOptions();
		return () => {
			mounted = false;
		};
	}, []);

	const updateField = (event) => {
		const { name, value } = event.target;
		setFormData((previous) => ({ ...previous, [name]: value }));
	};

	const handleFileChange = (event) => {
		const newFiles = Array.from(event.target.files || []);
		setSelectedFiles((previous) => {
			const filesToAdd = newFiles
				.filter((file) => !previous.some(({ file: selectedFile }) => (
					selectedFile.name === file.name
					&& selectedFile.size === file.size
					&& selectedFile.lastModified === file.lastModified
				)))
				.map((file, index) => ({
					id: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${index}`,
					file
				}));

			return [...previous, ...filesToAdd];
		});
		event.target.value = '';
	};

	const removeFile = (fileId) => {
		setSelectedFiles((previous) => previous.filter(({ id }) => id !== fileId));
	};

	const toggleSelection = (id, setter) => {
		setter((previous) => (
			previous.includes(id)
				? previous.filter((selectedId) => selectedId !== id)
				: [...previous, id]
		));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage({ text: '', type: '' });

		if (selectedMenus.length === 0 && selectedFolders.length === 0) {
			setMessage({ text: 'Selecione pelo menos um menu ou uma pasta de rede.', type: 'erro' });
			return;
		}

		const requestData = {
			...formData,
			menus: selectedMenus,
			folders: selectedFolders,
			attachments: selectedFiles.map(({ file }) => file)
		};

		setLoadingSubmit(true);
		try {
			if (aoEnviarSolicitacao) await aoEnviarSolicitacao(requestData);
			setMessage({ text: 'Solicitação preparada com sucesso.', type: 'sucesso' });
		} catch (error) {
			setMessage({ text: error.message || 'Não foi possível enviar a solicitação.', type: 'erro' });
		} finally {
			setLoadingSubmit(false);
		}
	};

	const returnToDashboard = () => {
		if (aoVoltarDashboard) {
			aoVoltarDashboard();
			return;
		}
		navigate('/dashboard');
	};

	return (
		<div className="requisicao-page">
			<main className="requisicao-card">
				<div className="requisicao-title">
					<Header message="Solicite os acessos necessários para realizar suas atividades." />
				</div>

				{message.text && (
					<div className={`requisicao-message requisicao-message--${message.type}`} role="alert">
						{message.text}
					</div>
				)}

				<form className="requisicao-form" onSubmit={handleSubmit}>
					<section className="requisicao-section requisicao-section-dados">
						<div className="requisicao-section-heading">
							<h2>Dados da solicitação</h2>
							<span>Campos obrigatórios</span>
						</div>
						<div className="requisicao-form-grid">
                            <div className="requisicao-input-group">
								<label htmlFor="request-registration">Matrícula <span className="requisicao-label-optional">(opcional)</span></label>
								<input id="request-registration" name="registration" className="requisicao-input" value={formData.registration} onChange={updateField} />
							</div>
                            <div className="requisicao-input-group">
								<label htmlFor="request-cpf">CPF</label>
								<input
									id="request-cpf"
									name="cpf"
									className="requisicao-input"
									inputMode="numeric"
									pattern="[0-9]{11}"
									placeholder="Somente números"
									value={formData.cpf}
									onChange={updateField}
									required
								/>
							</div>
							<div className="requisicao-input-group">
								<label htmlFor="request-name">Nome completo</label>
								<input id="request-name" name="name" className="requisicao-input" value={formData.name} onChange={updateField} required />
							</div>
							<div className="requisicao-input-group">
								<label htmlFor="request-email">E-mail</label>
								<input id="request-email" name="email" type="email" className="requisicao-input" value={formData.email} onChange={updateField} required />
							</div>
							<div className="requisicao-input-group">
								<label htmlFor="request-position">Cargo</label>
								<input id="request-position" name="position" className="requisicao-input" placeholder="Informe seu cargo" value={formData.position} onChange={updateField} required />
							</div>
							<div className="requisicao-input-group">
								<label htmlFor="request-employment-type">Vínculo funcional</label>
								<select
									id="request-employment-type"
									name="employmentType"
									className="requisicao-input"
									value={formData.employmentType}
									onChange={updateField}
									required
								>
									<option value="">Selecione o vínculo</option>
									<option value="concursado">Funcionário concursado</option>
									<option value="cargo-comissao">Cargo em comissão</option>
									<option value="contrato-temporario">Contrato temporário</option>
									<option value="estagiario">Estagiário</option>
									<option value="terceirizado">Terceirizado</option>
									<option value="conveniado">Conveniado</option>
								</select>
							</div>
						</div>
						<div className="requisicao-input-group">
							<label htmlFor="request-justification">Justificativa</label>
							<textarea id="request-justification" name="justification" className="requisicao-input requisicao-textarea" placeholder="Descreva a necessidade desses acessos" value={formData.justification} onChange={updateField} required />
						</div>
						<div className="requisicao-input-group">
							<label htmlFor="request-attachment">Anexos</label>
							<input
								id="request-attachment"
								name="attachment"
								type="file"
								multiple
								className="requisicao-file-input"
								onChange={handleFileChange}
							/>
							<label className="requisicao-file-picker" htmlFor="request-attachment">
								<strong>Selecionar arquivos</strong>
								<span aria-live="polite">
									{selectedFiles.length === 0
										? 'Nenhum arquivo escolhido'
										: `${selectedFiles.length} arquivo${selectedFiles.length === 1 ? '' : 's'} escolhido${selectedFiles.length === 1 ? '' : 's'}`}
								</span>
							</label>
							{selectedFiles.length > 0 && (
								<div className="requisicao-file-list">
									{selectedFiles.map(({ id, file }, index) => (
										<div className="requisicao-file-item" key={id}>
											<div>
												<strong>Anexo {index + 1}</strong>
												<span>{file.name}</span>
												<small>{file.type || 'Tipo não informado'} | {(file.size / 1024).toFixed(1)} KB</small>
											</div>
											<button type="button" className="requisicao-file-remove" onClick={() => removeFile(id)}>
												Remover
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</section>

					<section className="requisicao-section">
						<div className="requisicao-section-heading">
							<h2>Recursos solicitados</h2>
							<span>Selecione um ou mais itens</span>
						</div>
						{loadingOptions ? (
							<p className="requisicao-empty-state">Carregando opções de acesso...</p>
						) : (
							<div className="requisicao-options-grid">
								<div className="requisicao-option-panel">
									<h3>Menus de sistema</h3>
									{menuTree.length > 0 ? menuTree.map((menu) => (
										<MenuOption key={getItemId(menu)} menu={menu} selectedMenus={selectedMenus} onToggle={(id) => toggleSelection(id, setSelectedMenus)} />
									)) : <p className="requisicao-empty-state">Nenhum menu disponível.</p>}
								</div>
								<div className="requisicao-option-panel">
									<h3>Pastas de rede</h3>
									{folders.length > 0 ? folders.map((folder) => {
										const folderId = getItemId(folder);
										return (
											<label className="requisicao-check-option" key={folderId}>
												<input type="checkbox" checked={selectedFolders.includes(folderId)} onChange={() => toggleSelection(folderId, setSelectedFolders)} />
												<span>{getItemName(folder)}</span>
											</label>
										);
									}) : <p className="requisicao-empty-state">Nenhuma pasta disponível.</p>}
								</div>
							</div>
						)}
					</section>

					<div className="requisicao-actions">
						<button type="button" className="btn-secundario" onClick={returnToDashboard}>Cancelar</button>
						<button type="submit" className="btn-primario" disabled={loadingOptions || loadingSubmit}>
							{loadingSubmit ? 'Enviando...' : 'Enviar solicitação'}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}
