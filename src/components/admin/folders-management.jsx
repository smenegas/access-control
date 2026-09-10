import React, { useEffect, useState } from "react";
import "../common/messages.css";
import "./account-management.css";

const emptyFolder = {
	id: null,
	name: "",
	path: "",
	observations: "",
};

export default function FoldersManagement({
	getFolders = async () => [],
	createFolder = async folder => ({ ...folder, id: Date.now() }),
	updateFolder = async (_id, folder) => folder,
	deleteFolder = async () => undefined,
}) {
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
			name: folder.name || "",
			path: folder.path || "",
			observations: folder.observations || "",
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
		if (!folderToSave.name.trim() || !folderToSave.path.trim()) {
			setMessage({ type: "erro", text: "Informe o nome e o caminho da pasta." });
			return;
		}

		setSaving(true);
		try {
			if (mode === "edit") {
				await updateFolder(formData.id, formData);
				setMessage({ type: "sucesso", text: "Pasta atualizada com sucesso." });
			} else {
				await createFolder(newFolder);
				setMessage({ type: "sucesso", text: "Pasta cadastrada com sucesso." });
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
		if (!window.confirm(`Tem certeza que deseja excluir a pasta "${folder.name}"?`)) return;

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

	return (
		<div className="secretary-management-container">
			<h2>Gestão de Pastas de Rede</h2>

			{message.text && (
				<div className={message.type === "sucesso" ? "success-message" : "error-message"} style={{ marginBottom: 16 }}>
					{message.text}
				</div>
			)}

			<form
				onSubmit={event => {
					event.preventDefault();
					handleSave();
				}}
				className="form-adicionar"
			>
				<input
					type="text"
					placeholder="Nome da pasta"
					value={newFolder.name}
					onChange={event => setNewFolder({ ...newFolder, name: event.target.value })}
					className="login-input"
					required
				/>
				<input
					type="text"
					placeholder="Caminho da rede"
					value={newFolder.path}
					onChange={event => setNewFolder({ ...newFolder, path: event.target.value })}
					className="login-input"
					required
				/>
				<input
					type="text"
					placeholder="Observações"
					value={newFolder.observations}
					onChange={event => setNewFolder({ ...newFolder, observations: event.target.value })}
					className="login-input"
				/>
				<button type="submit" className="btn-primario" disabled={saving}>
					{mode === "edit" ? "Salvar" : "Adicionar"}
				</button>
				{mode === "edit" && (
					<button type="button" className="btn-secundario" onClick={cancelOperation}>
						Cancelar
					</button>
				)}
			</form>

			{loading ? (
				<div className="warning-message">Carregando pastas de rede...</div>
			) : (
				<table className="tabela-solicitacoes">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Caminho</th>
							<th>Observações</th>
							<th style={{ width: "150px" }}>Ações</th>
						</tr>
					</thead>
					<tbody>
						{folders.map(folder => (
							<tr key={folder.id}>
								<td>{mode === "edit" && formData.id === folder.id ? (
									<input type="text" value={formData.name} onChange={event => setFormData({ ...formData, name: event.target.value })} className="login-input" style={{ padding: "5px" }} />
								) : <strong>{folder.name}</strong>}</td>
								<td>{mode === "edit" && formData.id === folder.id ? (
									<input type="text" value={formData.path} onChange={event => setFormData({ ...formData, path: event.target.value })} className="login-input" style={{ padding: "5px" }} />
								) : folder.path}</td>
								<td>{mode === "edit" && formData.id === folder.id ? (
									<input type="text" value={formData.observations} onChange={event => setFormData({ ...formData, observations: event.target.value })} className="login-input" style={{ padding: "5px" }} />
								) : (folder.observations || "-")}</td>
								<td>
									{mode === "edit" && formData.id === folder.id ? (
										<div style={{ display: "flex", gap: "10px" }}>
											<button type="button" className="btn-secundario" onClick={handleSave}>Salvar</button>
											<button type="button" className="btn-secundario" onClick={cancelOperation}>Cancelar</button>
										</div>
									) : (
										<div style={{ display: "flex", gap: "10px" }}>
											<button type="button" className="btn-secundario" onClick={() => startEdit(folder)}>Editar</button>
											<button type="button" className="btn-secundario" onClick={() => handleDelete(folder)}>Excluir</button>
										</div>
									)}
								</td>
							</tr>
						))}
						{folders.length === 0 && (
							<tr><td colSpan="4" className="empty-row">Nenhuma pasta de rede cadastrada.</td></tr>
						)}
					</tbody>
				</table>
			)}
		</div>
	);
}
