import React, { useEffect, useState } from "react";
import { getFolders, createFolder, updateFolder, deleteFolder } from "../../../helpers/folders/network-folders";
import "../../common/messages.css";
import "./folders-management.css";

const emptyFolder = {
	id: null,
	folder_name: "",
	folder_path: "",
	observation: "",
};

export default function FoldersManagement() {
	const [folders, setFolders] = useState([]);
	const [newFolder, setNewFolder] = useState(emptyFolder);
	const [formData, setFormData] = useState(emptyFolder);
	const [mode, setMode] = useState("");
	const [message, setMessage] = useState({ type: "", text: "" });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const loadFolders = async () => {
		setLoading(true);
		try {
			const data = await getFolders();
			setFolders(Array.isArray(data) ? data : []);
		} catch (error) {
			setMessage({
				type: "erro",
				text: error.message || "Erro ao carregar pastas de rede.",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFolders();
	}, []);

	const startEdit = folder => {
		setFormData({
			id: folder.id,
			folder_name: folder.folder_name || "",
			folder_path: folder.folder_path || "",
			observation: folder.observation || "",
		});
		setMode("edit");
		setMessage({ type: "", text: "" });
	};

	const cancelOperation = () => {
		setMode("");
		setFormData(emptyFolder);
	};

	const handleSave = async () => {
		const folderToSave = mode === "edit" ? formData : newFolder;
		if (!folderToSave.folder_name.trim() || !folderToSave.folder_path.trim()) {
			setMessage({ type: "erro", text: "Informe o nome e o caminho da pasta." });
			return;
		}

		setSaving(true);
		try {
			if (mode === "edit") {
				const foldersChanged = await updateFolder(formData.id, formData);
				if (foldersChanged > 0) {
					setMessage({ type: "sucesso", text: "Pasta atualizada com sucesso." });
				} else {
					setMessage({ type: "erro", text: "Nenhuma alteração foi feita na pasta." });
				}
			} else {
				const foldersCreated = await createFolder(newFolder);
				if (foldersCreated > 0) {
					setMessage({ type: "sucesso", text: "Pasta cadastrada com sucesso." });
				}
				else {
					setMessage({ type: "erro", text: "Nenhuma pasta foi cadastrada." });
				}	
			}
			setNewFolder(emptyFolder);
			cancelOperation();
			await loadFolders();
		} catch (error) {
			setMessage({
				type: "erro",
				text: error.message || "Erro ao salvar a pasta de rede.",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async folder => {
		if (!window.confirm(`Tem certeza que deseja excluir a pasta "${folder.folder_name}"?`)) return;

		try {
			await deleteFolder(folder.id);
			setMessage({ type: "sucesso", text: "Pasta excluída com sucesso." });
			await loadFolders();
		} catch (error) {
			setMessage({
				type: "erro",
				text: error.message || "Erro ao excluir a pasta de rede.",
			});
		}
	};

	function EditIcon({ title = "Editar" }) {
		return (
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label={title} role="img">
			<title>{title}</title>
			<path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-9.2 9.2-2.1.4.4-2.1 9.2-9.2zM3 17h14v2H3v-2z" fill="#2563eb"/>
			</svg>
		);
	};

	function DeleteIcon({ title = "Excluir" }) {
		return (
			<svg 
				width="20" height="20" 
				viewBox="0 0 20 20" 
				fill="none" aria-label={title} 
				role="img"
			>
			<title>{title}</title>
			<path d="M6 7v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7m-9 0h10m-7-3h4a1 1 0 0 1 1 1v1H6V5a1 1 0 0 1 1-1z" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		);
	};

	return (
		<div className="folder-management-container">
			<h2>Gestão de Pastas de Rede</h2>

			{message.text && (
				<div className={message.type === "sucesso" ? "folder-message-success" : "folder-message-error"}>
					{message.text}
				</div>
			)}

			<form
				onSubmit={event => {
					event.preventDefault();
					handleSave();
				}}
				className="folder-management-form"
			>
				<div className="folder-form-row">
					<input
						type="text"
						placeholder="Nome da pasta"
						value={newFolder.folder_name}
						onChange={event => setNewFolder({ ...newFolder, folder_name: event.target.value })}
						className="folder-form-input"
						required
					/>
					<input
						type="text"
						placeholder="Caminho da rede"
						value={newFolder.folder_path}
						onChange={event => setNewFolder({ ...newFolder, folder_path: event.target.value })}
						className="folder-form-input"
						required
					/>
				</div>

				<textarea
					placeholder="Observações"
					value={newFolder.observation}
					onChange={event => setNewFolder({ ...newFolder, observation: event.target.value })}
					className="folder-form-textarea"
					rows={3}
				/>

				<div className="folder-form-actions">
					<button type="submit" className="folder-btn-primary" disabled={saving}>
						{mode === "edit" ? "Salvar" : "Adicionar"}
					</button>
					{mode === "edit" && (
						<button type="button" className="folder-btn-secondary" onClick={cancelOperation}>
							Cancelar
						</button>
					)}
				</div>
			</form>

			{loading ? (
				<div className="folder-warning-message">Carregando pastas de rede...</div>
			) : (
				<table className="folder-table">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Caminho</th>
							<th>Observações</th>
							<th className="folder-table-actions-header">Ações</th>
						</tr>
					</thead>
					<tbody>
						{folders.map(folder => (
							<tr key={folder.id}>
								<td>
									{mode === "edit" && formData.id === folder.id ? (
										<input
											type="text"
											value={formData.folder_name}
											onChange={event => setFormData({ ...formData, folder_name: event.target.value })}
											className="folder-table-input"
										/>
									) : <strong>{folder.folder_name}</strong>}
								</td>
								<td>
									{mode === "edit" && formData.id === folder.id ? (
										<input
											type="text"
											value={formData.folder_path}
											onChange={event => setFormData({ ...formData, folder_path: event.target.value })}
											className="folder-table-input"
										/>
									) : folder.folder_path}
								</td>
								<td>
									{mode === "edit" && formData.id === folder.id ? (
										<textarea
											value={formData.observation}
											onChange={event => setFormData({ ...formData, observation: event.target.value })}
											className="folder-table-textarea"
											rows={3}
										/>
									) : (folder.observation || "-")}
								</td>
								<td>
									{mode === "edit" && formData.id === folder.id ? (
										<div className="folder-table-actions">
											<button type="button" className="folder-btn-secondary" onClick={handleSave}>Salvar</button>
											<button type="button" className="folder-btn-secondary" onClick={cancelOperation}>Cancelar</button>
										</div>
									) : (
											<div style={{ display: "flex", gap: "10px" }}>
												<button
													type="button"
													className="folder-btn-secondary"
													title="Editar"
													aria-label="Editar"
													onClick={() => startEdit(folder)}
													style={{ background: "none", border: "none", padding: 10, cursor: "pointer", display: "flex", alignItems: "center" }}
												>
													<EditIcon />
												</button>
												<button
													type="button"
													className="folder-btn-secondary"
													title="Excluir"
													aria-label="Excluir"
													onClick={() => handleDelete(folder)}
													style={{ background: "none", border: "none", padding: 10, cursor: "pointer", display: "flex", alignItems: "center" }}
												>
													<DeleteIcon />
												</button>
										</div>
									)}
								</td>
							</tr>
						))}
						{folders.length === 0 && (
							<tr>
								<td colSpan="4" className="folder-empty-row">
									Nenhuma pasta de rede cadastrada.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			)}
		</div>
	);
}
