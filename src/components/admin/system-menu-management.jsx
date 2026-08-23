import React, { useState, useEffect } from 'react';
import SystemModuleAdd from './system-module-add';
import SystemModuleEdit from './system-module-edit';

import './system-menu-management.css';
import '../common/messages.css';
import SystemMenuAdd from './system-menu-add';

//TODO: Mudar o código para que os nomes de variávies e funções estejam em inglês.
//TODO: Passar os estilos para um arquivo CSS separado, para manter o código mais limpo e organizado.
// Componente Recursivo para desenhar a árvore de edição
const BuildMenuTree = ({ menu, activeNode, selectToEdit, addChildren, prepareToAddChildren }) => {
  const isSelected = activeNode?.id === menu?.id;
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`menu-item-wrapper ${menu?.father_menu_id ? 'menu-item-wrapper--nested' : ''}`}>
      <div
        className={`menu-item-card ${menu?.father_menu_id === '' ? 'menu-item-card--root' : 'menu-item-card--child'}`}
        style={{ backgroundColor: isSelected ? '#ebf8ff' : '#ffffff', borderColor: isSelected ? '#3182ce' : '#e2e8f0' }}
      >
        <div className="menu-item-main">
          {menu?.childrens && menu?.childrens.length > 0 && (
            <button
              type="button"
              className="menu-item-toggle-btn"
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
              title={expanded ? 'Colapsar' : 'Expandir'}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <span>{menu?.father_menu_id === '' ? '📦' : '↳ 📄'}</span>
          <span className={`menu-item-label ${menu?.father_menu_id !== '' ? 'menu-item-label--child' : ''}`}>
            {menu?.name}
          </span>
          <span className="menu-item-order-badge">
            Ordem: {menu?.order || 1}
          </span>
        </div>

        <div className="menu-item-actions">
          <button
            type="button"
            className="btn-secundario menu-item-action-btn"
            onClick={() => prepareToAddChildren(menu)}
            title="Adicionar submenu dentro deste item"
          >
            {menu?.father_menu_id === '' ? '➕ Adicionar Menu' : '➕ Adicionar Submenu'}
          </button>
          <button
            type="button"
            className="btn-secundario menu-item-action-btn"
            onClick={() => selectToEdit(menu)}
            title="Editar este item"
          >
            ✏️ Editar
          </button>
        </div>
      </div>

      {/* Renderização recursiva de filhos */}
      {menu?.childrens && menu?.childrens.length > 0 && expanded && (
        <div className="menu-tree-children">
          {menu?.childrens.map(child => (
            <BuildMenuTree
              key={child.id}
              menu={child}
              activeNode={activeNode}
              selectToEdit={selectToEdit}
              addChildren={addChildren}
              prepareToAddChildren={prepareToAddChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function SystemMenuManagement() {
  const [menuTree, setMenuTree] = useState([]);
  const [planeList, setPlaneList] = useState([]);
  
  // Estado do formulário de cadastro/edição
  const [typeOfNode, setTypeOfNode] = useState(''); // 'module' or 'menu'
  const [mode, setMode] = useState(''); // 'add' or 'edit'
  const [Id, setId] = useState(0);
  const [moduleOrder, setModuleOrder] = useState(1);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    father_menu_id: '',
    order: moduleOrder
  });

  const getToken = () => sessionStorage.getItem('@AppAcessos:token');

  useEffect(() => {
    carregarMenus();
  }, []);

  const carregarMenus = async () => {
    //TODO: Implementar a lógica para carregar os menus do backend e atualizar o estado menuTree e planeList
  };

  // Transforma a árvore de volta em lista plana para popular o <select> do Menu Pai
  const convertToFlatList = (nodos) => {
    let array = [];
    nodos.forEach(no => {
      array.push({ id: no.id, name: no.name });
      if (no.childrens && no.childrens.length > 0) {
        array = array.concat(convertToFlatList(no.childrens));
      }
    });
    return array;
  };

  const prepareNewRootModule = () => {
    setId(prevId => prevId + 1);
    setTypeOfNode('module');
    setMode('add');
    setFormData({ 
      id: Id, 
      name: '', 
      father_menu_id: '', 
      order: moduleOrder
    });
    focarFormulario();
  };

  const prepareToAddChildren = (itemPai) => {
    setTypeOfNode('menu');
    setMode('add');
    setId(prevId => prevId + 1);
    setFormData({ 
      id: Id, 
      name: '', 
      father_menu_id: itemPai.id, 
      order: (itemPai.childrens?.length || 0) + 1 
    });
    focarFormulario();
  };

  const prepareToEdit = (menu) => {
    setTypeOfNode('menu');
    setEditMode(true);
    setMode('edit');
    setFormData({
      id: menu.id,
      name: menu.name,
      father_menu_id: menu.father_menu_id || '',
      order: menu.order || 1
    });
    focarFormulario();
  };

  const focarFormulario = () => {
    setTimeout(() => {
      document.getElementById('cartao-formulario-menu')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //TODO: Implementar a lógica de envio do formulário para criar ou atualizar um menu/módulo
  };

  const handleExcluir = async () => {
    //TODO: Implementar a exclusão de um menu ou módulo
  };

  // Recusive function to add a child menu item to the correct parent in the tree
  const addChild = async (nodes) => {
    for (let node of nodes) {
      if (node.id === formData.father_menu_id) {
        //node.childrens = node.childrens || [];
        node.childrens.push({ ...formData, childrens: [] });
        return true; // Child added
      }
      if (node.childrens && node.childrens.length > 0) {
        if ( await addChild(node.childrens)) return true; // Recurse
      }
    }
    return false; // Not found
  };

  // Add new menu item to the tree
  const addMenuItemToTree = async () => {
    if (formData.father_menu_id === '') {
      // If it's a root module, add it to the root of the tree
      setMenuTree(prevTree => [...prevTree, { ...formData, childrens: [] }]);
      prepareNewRootModule(); // Reset form for next entry
      setMode('');
      setModuleOrder(prevOrder => prevOrder + 1); // Increment order for next root module
    } else {
      // If it's a submenu.
      const updatedTree = [...menuTree];
      //setId(prevId => prevId + 1);
      //updatedTree.id = Id;
      await addChild(updatedTree);
      setMenuTree(updatedTree);
      prepareToAddChildren({ id: formData.father_menu_id, name: '', childrens: [] }); // Reset form for next entry
      setMode('');
    }
    setPlaneList(convertToFlatList(menuTree));
  };

  // Cancel operation and reset the form
  const cancelOperation = () => {
    setMode('');
    setTypeOfNode('');
    setFormData({ id: null, name: '', father_menu_id: '', order: 1 });
  };

  return (
    <div className="system-menu-management">
      
      {/* ===================================================================
          PARTE 1: ÁRVORE HIERÁRQUICA DE MÓDULOS E MENUS
         =================================================================== */}
      <div>
        <div className="cabecalho-lista">
          <div>
            <h2>Estrutura de Módulos e Menus</h2>
            <p style={{ color: '#7f8c8d', fontSize: '14px', margin: '4px 0 0 0' }}>
              Navegue pela árvore de acesso ou adicione novos módulos principais.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'right', marginBottom: '20px'}}>
            <button 
              type="button" 
              className="btn-primario"
              onClick={prepareNewRootModule}
            >
              + Módulo Principal
            </button>
        </div>
        {menuTree.length === 0 ? (
          <div className="warning-message">
            <p>Nenhum módulo cadastrado. Clique no botão acima para criar o primeiro.</p>
          </div>
        ) : (
          <div className="card menu-tree-card">
            {menuTree.map(item => (
              <BuildMenuTree
                key={item.id}
                menu={item}
                activeNode={formData}
                selectToEdit={prepareToEdit}
                addChildren={addChild}
                prepareToAddChildren={prepareToAddChildren}
              />
            ))}
          </div>
        )}
      </div>

      {
      /* ===================================================================
          PARTE 2: FORMULÁRIO EM CARTÃO (CRIAÇÃO E EDIÇÃO)
         =================================================================== */}
      {mode === 'add' && typeOfNode === 'module' && (
        <SystemModuleAdd
          formData={formData}
          setFormData={setFormData}
          addMenuItemToTree={addMenuItemToTree}
          cancelOperation={cancelOperation}
        ></SystemModuleAdd>
      )}

      {mode === 'edit' && typeOfNode === 'module' && (
        <SystemModuleEdit
          formData={formData}
          planeList={planeList}
          handleSubmit={handleSubmit}
          setFormData={setFormData}
          cancelOperation={cancelOperation}
          handleExcluir={handleExcluir}
        ></SystemModuleEdit>
      )}

      {mode === 'add' && typeOfNode === 'menu' && (
        <SystemMenuAdd
          formData={formData}
          setFormData={setFormData}
          addMenuItemToTree={addMenuItemToTree}
          cancelOperation={cancelOperation}
        ></SystemMenuAdd>
      )}
    </div>
  );
}