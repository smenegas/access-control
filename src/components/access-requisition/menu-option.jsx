import { getItemId, getItemName, getMenuChildren } from './menu-option-utils';

export default function MenuOption({ menu, selectedMenus, onToggle }) {
	const menuId = getItemId(menu);
	const children = getMenuChildren(menu);

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
