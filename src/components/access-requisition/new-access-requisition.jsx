import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDataByToken } from '../../helpers/users/users';
import { getFolders } from '../../helpers/folders/network-folders';
import { getSecretaries } from '../../helpers/secretaries/secretaries';
import { LoadMenuTree } from '../../helpers/system-menu/system-menu';
import { getRelationships } from '../../helpers/relationships/relationships';
import { uploadFiles, createAccessRequisition } from '../../helpers/access-requisitions/access-requsitions';
import Header from '../common/header';
import AccessRequisitionSuccess from './access-requisition-success';
import './new-access-requisition.css';
import '../common/messages.css';

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

export default function NewAccessRequisition() {
	const [userFromToken, setUserFromToken] = useState(null);
	const [secretaries, setSecretaries] = useState([]);

	useEffect(() => {
		let mounted = true;

		const loadUser = async () => {
			const userData = await getUserDataByToken();
			if (mounted) setUserFromToken(userData);
		};

		loadUser();
		return () => {
			mounted = false;
		};
	}, []);

	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		position: '',
		secretary_id: '',
		registration_number: '',
		cpf: '',
		relationship_id: '',
		obs: '',
		justification: ''
	});

	useEffect(() => {
		if (!userFromToken) return;

		setFormData((previous) => ({
			...previous,
			name: previous.name || userFromToken.name || '',
			email: previous.email || userFromToken.email || '',
			secretary_id: previous.secretary_id || userFromToken.secretary_id || '',
			registration_number: previous.registration_number || userFromToken.registration_number || '',
			relationship_id: previous.relationship_id || userFromToken.relationship_id || ''
		}));
	}, [userFromToken]);
	
	const [menuTree, setMenuTree] = useState([]);
	const [folders, setFolders] = useState([]);
	const [selectedMenus, setSelectedMenus] = useState([]);
	const [selectedFolders, setSelectedFolders] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [loadingOptions, setLoadingOptions] = useState(true);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });
	const [submissionSuccess, setSubmissionSuccess] = useState(null);
	const [relationships, setRelationships] = useState([]);
	const [uploadFieldMessage, setUploadFieldMessage] = useState('');
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

	useEffect(() => {
		loadRelationships();
	}, []);

	const loadRelationships = async () => {
		try {
			const relationshipsResponse = await getRelationships();
			setRelationships(getCollection(relationshipsResponse));
		} catch (error) {
			setMessage({
				text: error.message || 'Não foi possível carregar os vínculos funcionais.',
				type: 'erro'
			});
		}
	};
	
	const loadSecretaries = async () => {
		try {
			const secretariesResponse = await getSecretaries();
			setSecretaries(getCollection(secretariesResponse));
		} catch (error) {
			setMessage({
				text: error.message || 'Não foi possível carregar as secretarias.',
				type: 'erro'
			});
		}
	};

	useEffect(() => {
		loadSecretaries();
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
		setLoadingSubmit(true);

		const requestData = {
			...formData,
			menus: selectedMenus,
			folders: selectedFolders,
			attachments: selectedFiles.map(({ file }) => file)
		};

		// Send the request data to the server
		try {
			const requestDataAux = { ...requestData };
			delete requestDataAux.attachments; // Remove attachments for logging
			delete requestDataAux.menus; // Remove menus for logging
			delete requestDataAux.folders; // Remove folders for logging
			const createResponse = await createAccessRequisition(requestDataAux);
			if (!createResponse || !createResponse.id) {
				setMessage({ text: 'Não foi possível enviar a solicitação.', type: 'erro' });
				return;
			}

			const requisitionId = Array.isArray(createResponse.id)
				? createResponse.id[0]
				: createResponse.id;
			if (requestData.attachments.length > 0) {
				if (!requisitionId) {
					setMessage({ text: 'Não foi possível identificar a solicitação para enviar os arquivos.', type: 'erro' });
					return;
				}

				await uploadFiles(requestData.attachments, requisitionId);
			}

			setSubmissionSuccess({
				files: selectedFiles.map(({ id, file }) => ({
					id,
					name: file.name,
					type: file.type,
					size: file.size
				}))
			});
		} catch (error) {
			setMessage({
				text: error.message || 'Não foi possível enviar a solicitação ou os arquivos anexados.',
				type: 'erro'
			});
		} finally {
			setLoadingSubmit(false);
		}
	};

	// Function to get the message from relationships based on the selected relationship
	const getRelationshipMessage = (relationshipId) => {
		const relationship = relationships.find(
			(rel) => String(getItemId(rel)) === relationshipId
		);
		return relationship?.message || '';
	};

	const returnToDashboard = () => {
		navigate('/dashboard');
	};

	if (submissionSuccess) {
		return (
			<AccessRequisitionSuccess
				files={submissionSuccess.files}
				onReturn={returnToDashboard}
			/>
		);
	}

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
								<input id="request-registration" name="registration_number" className="requisicao-input" value={formData.registration_number} onChange={updateField} />
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
								<label htmlFor="request-position">Cargo<span className="requisicao-label-optional">&nbsp;(opcional)</span></label>
								<input 
									id="request-position" 
									name="position" 
									className="requisicao-input" 
									placeholder="Informe seu cargo" 
									value={formData.position} 
									onChange={updateField} 
								/>
							</div>
							<div className="requisicao-input-group">
								<label htmlFor="request-secretary">Secretaria</label>
								<select
									id="request-secretary"
									name="secretary_id"
									className="requisicao-input"
									value={formData.secretary_id}
									onChange={updateField}
									required
								>
									<option value="">Selecione a secretaria</option>
									{secretaries.map((secretary) => (
										<option key={getItemId(secretary)} value={getItemId(secretary)}>
											{getItemName(secretary)}
										</option>
									))}
								</select>
							</div>
							<div className="requisicao-input-group">
								<label htmlFor="request-relationship">Vínculo funcional</label>
								
								<select
									id="request-relationship"
									name="relationship_id"
									className="requisicao-input"
									value={formData.relationship_id}
									onChange={(event) => {
										updateField(event);
										setUploadFieldMessage(getRelationshipMessage(event.target.value));
									}}
									required
								>
									{relationships.length === 0 && (
										<option value="">Não há vínculos disponíveis</option>
									)}
									{relationships.length > 0 && (
										<option value="">Selecione o vínculo</option>
									)}
									{relationships.map((relationship) => (
										<option key={getItemId(relationship)} value={getItemId(relationship)}>
											{getItemName(relationship)}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="requisicao-input-group">
							<label htmlFor="request-observations">Observações<span className="requisicao-label-optional">&nbsp;(opcional)</span></label>
							<textarea
								id="request-observations"
								name="obs"
								className="requisicao-input requisicao-textarea"
								placeholder="Escreva aqui qualquer observação que julgar necessária"
								value={formData.obs}
								onChange={updateField}
								maxLength={500}
							/>
							<span className="requisicao-character-count" aria-live="polite">
								{formData.obs.length}/500 caracteres
							</span>
						</div>
						<div className="requisicao-input-group">
							<label htmlFor="request-justification">Justificativa<span className="requisicao-label-optional">&nbsp;(opcional)</span></label>
							<textarea
								id="request-justification"
								name="justification"
								className="requisicao-input requisicao-textarea"
								placeholder="Descreva a necessidade desses acessos"
								value={formData.justification}
								onChange={updateField}
								maxLength={500}
							/>
							<span className="requisicao-character-count" aria-live="polite">
								{formData.justification.length}/500 caracteres
							</span>
						</div>

						{uploadFieldMessage && (
							<div className="warning-message" role="alert">
								<p>{uploadFieldMessage}</p>
							</div>
						)}

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
