import '../common/messages.css';
import './system-menu-management.css';
import './system-menu-add.css';

export default function SystemMenuEdit({
    formData, 
    setFormData, 
    cancelOperation,
    updateMenuItemInTree,
 }) {

    return (
    <div id="cartao-formulario-menu" className="card menu-form-card">
        <div className="menu-form-header">
            <h3 className="menu-form-title">
                Editar Item
            </h3>
        </div>

        <form 
            className="login-form"
            onSubmit={e => {
                e.preventDefault();
                updateMenuItemInTree();
            }}
        >
        <div className="menu-add-form-grid">
        
        {/* Nome do Menu */}
        <div className="input-group">
            <label htmlFor="menu-name">Nome do Menu</label>
            <input 
            id="menu-name" 
            type="text" 
            required 
            className="login-input"
            placeholder="Informe o nome do menu"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            />
        </div>

        {/* Ordem de Exibição */}
        {/*<div className="input-group">
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
        </div>*/}

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
}