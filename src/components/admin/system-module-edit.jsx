import "../common/messages.css";
import "./system-menu-management.css";

export default function SystemModuleEdit({ 
    formData, 
    setFormData, 
    editMode, 
    handleSubmit, 
    handleExcluir, 
    prepareNewRootModule, 
    planeList, 
    Id 
}) {

    return (
    <div id="cartao-formulario-menu" className="card menu-form-card">
        <div className="menu-form-header">
        <h3 className="menu-form-title">
            {editMode ? `Editar Item: ${formData.nome}` : (formData.menu_pai_id ? 'Novo Submenu' : 'Novo Módulo Principal')}
        </h3>
        <button
            type="button"
            className="btn-secundario menu-form-delete-btn"
            onClick={handleExcluir}
        >
            🗑️ Excluir Item
        </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
        <div className="menu-form-grid">
        
        {/* Nome do Módulo / Menu */}
        <div className="input-group">
            <label htmlFor="menu-nome">Nome do Módulo ou Menu</label>
            <input 
            id="menu-nome" 
            type="text" 
            required 
            className="login-input"
            placeholder="Ex: Folha de Pagamento ou Cadastro de Servidor"
            value={formData.nome}
            onChange={e => setFormData({...formData, nome: e.target.value})}
            />
        </div>

        {/* Menu Pai (Subordinação) */}
        <div className="input-group">
            <label htmlFor="menu-pai">Hierarquia (Pertence a)</label>
            <select 
            id="menu-pai" 
            className="login-input select-input"
            value={formData.menu_pai_id}
            onChange={e => setFormData({...formData, menu_pai_id: e.target.value})}
            >
            <option value="">-- Raiz (Módulo Principal) --</option>
            {planeList
                .filter(item => item.id !== formData.id) // Evita que um menu seja pai dele mesmo
                .map(item => (
                <option key={item.id} value={item.id}>
                    {item.nome}
                </option>
                ))}
            </select>
        </div>

        {/* Ordem de Exibição */}
        <div className="input-group">
            <label htmlFor="menu-ordem">Ordem na Lista</label>
            <input 
            id="menu-ordem" 
            type="number" 
            min="1"
            required 
            className="login-input"
            value={formData.ordem}
            onChange={e => setFormData({...formData, ordem: e.target.value})}
            />
        </div>

        </div>

        <div className="menu-form-footer">
        <button 
            type="button" 
            className="btn-secundario" 
            onClick={prepareNewRootModule}
        >
            Limpar / Cancelar
        </button>
        <button 
            type="submit" 
            className="btn-primario" 
            style={{ padding: '10px 25px' }}
        >
            Salvar
        </button>
        </div>
        </form>
    </div>
    );
};