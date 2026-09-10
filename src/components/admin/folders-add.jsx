import "../common/messages.css";
import "./system-menu-management.css";
import "./system-module-add.css";

export default function FoldersAdd({
	formData,
	setFormData,
	cancelOperation,
	addFolder,
}) {
	return (
		<div id="cartao-formulario-pasta" className="card menu-form-card">
			<div className="menu-form-header">
				<h3 className="menu-form-title">Nova Pasta de Rede</h3>
			</div>

			<form
				className="login-form"
				onSubmit={event => {
					event.preventDefault();
					addFolder();
				}}
			>
				<div className="menu-add-form-grid">
					<div className="input-group">
						<label htmlFor="folder-name">Nome da Pasta</label>
						<input
							id="folder-name"
							type="text"
							required
							maxLength="100"
							className="login-input"
							placeholder="Informe o nome da pasta"
							value={formData.name}
							onChange={event =>
								setFormData({ ...formData, name: event.target.value })
							}
						/>
					</div>

					<div className="input-group">
						<label htmlFor="folder-path">Caminho da Rede</label>
						<input
							id="folder-path"
							type="text"
							required
							maxLength="255"
							className="login-input"
							placeholder={"Ex.: \\\\servidor\\compartilhamento"}
							value={formData.path}
							onChange={event =>
								setFormData({ ...formData, path: event.target.value })
							}
						/>
					</div>

					<div className="input-group" style={{ gridColumn: "1 / -1" }}>
						<label htmlFor="folder-observations">Observações</label>
						<textarea
							id="folder-observations"
							maxLength="500"
							className="login-input"
							placeholder="Adicione informações relevantes sobre a pasta"
							rows="4"
							value={formData.observations}
							onChange={event =>
								setFormData({
									...formData,
									observations: event.target.value,
								})
							}
						/>
					</div>
				</div>

				<div className="menu-form-footer">
					<button
						type="button"
						className="btn-secundario"
						onClick={cancelOperation}
					>
						Cancelar
					</button>
					<button type="submit" className="btn-primario" style={{ padding: "10px 25px" }}>
						Salvar
					</button>
				</div>
			</form>
		</div>
	);
}
