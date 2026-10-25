import React from 'react';
import Header from '../common/header';
import './access-requisition-success.css';

function formatFileSize(size) {
	if (size < 1024) return `${size} bytes`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AccessRequisitionSuccess({ files, onReturn }) {
	return (
		<div className="requisicao-page requisicao-success-page">
			<Header message="Solicitação de acesso" />
			<main className="requisicao-success-card" aria-labelledby="requisicao-success-title">
				<div className="requisicao-success-icon" aria-hidden="true">
					<svg viewBox="0 0 48 48" focusable="false">
						<circle cx="24" cy="24" r="21" />
						<path d="m14 24 7 7 14-15" />
					</svg>
				</div>

				<p className="requisicao-success-kicker">Solicitação concluída</p>
				<h1 id="requisicao-success-title">Cadastro realizado com sucesso!</h1>
				<p className="requisicao-success-description">
					Sua solicitação foi registrada e seguirá para análise. Você pode acompanhar o andamento pelo seu dashboard.
				</p>

				<section className="requisicao-success-files" aria-labelledby="requisicao-success-files-title">
					<div className="requisicao-success-files-heading">
						<div>
							<h2 id="requisicao-success-files-title">Arquivos enviados</h2>
							<p>
								{files.length > 0
									? `${files.length} arquivo${files.length === 1 ? '' : 's'} anexado${files.length === 1 ? '' : 's'} à solicitação`
									: 'Nenhum arquivo foi anexado a esta solicitação.'}
							</p>
						</div>
						{files.length > 0 && (
							<span className="requisicao-success-file-count">{files.length}</span>
						)}
					</div>

					{files.length > 0 && (
						<ul className="requisicao-success-file-list">
							{files.map((file) => (
								<li className="requisicao-success-file" key={file.id}>
									<span className="requisicao-success-file-icon" aria-hidden="true">
										<svg viewBox="0 0 24 24" focusable="false">
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
											<path d="M14 2v6h6M8 13h8M8 17h8" />
										</svg>
									</span>
									<span className="requisicao-success-file-details">
										<strong title={file.name}>{file.name}</strong>
										<small>{file.type || 'Arquivo'} · {formatFileSize(file.size)}</small>
									</span>
								</li>
							))}
						</ul>
					)}
				</section>

				<button type="button" className="requisicao-success-button" onClick={onReturn}>
					Voltar para o dashboard
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</button>
			</main>
		</div>
	);
}
