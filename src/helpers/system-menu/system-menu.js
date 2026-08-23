export const AddMenuItem = async ( formData ) => {
    const token = getToken();
    const url = `${process.env.REACT_APP_API_URL}/system-menu`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    };

    try {
        return await fetch(url, requestOptions);
    } catch (error) {
        throw new Error('Erro ao adicionar item de menu.');
    }
};