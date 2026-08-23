import "../common/messages.css";
import "./system-menu-management.css";
import "./system-module-add.css";

export default function SystemModuleAdd({ 
    formData, 
    setFormData, 
    cancelOperation,
    addMenuItemToTree,
 }) {

    return (
    <div id="cartao-formulario-menu" className="card menu-form-card">
        <div className="menu-form-header">
            <h3 className="menu-form-title">
                Novo Módulo Principal
            </h3>
        </div>

        <form 
            className="login-form"
            onSubmit={e => {
                e.preventDefault();
                addMenuItemToTree();
            }}
        >
        <div className="menu-add-form-grid">
        
        {/* Nome do Módulo / Menu */}
        <div className="input-group">
            <label htmlFor="menu-name">Nome do Módulo</label>
            <input 
            id="menu-name" 
            type="text" 
            required 
            className="login-input"
            placeholder="Informe o nome do módlulo"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            />
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
            value={formData.menu_order}
            onChange={e => setFormData({...formData, menu_order: e.target.value})}
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