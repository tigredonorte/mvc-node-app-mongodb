const deleteProduct = async(id, csrf) => {
    const result = await fetch(`/admin/shop/product/${id}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    });
    console.log(result);
    if (result.status !== 200) {
        setStatusMessage(result.body.error ?? 'Error deleting product!', 'danger');
        return;
    }
    const element = document.getElementById(id);
    element.outerHTML = "";
    setStatusMessage(result.message ?? 'Product deleted!', 'success');
};

const setStatusMessage = (message, messageType) => {
    const element = document.getElementById('#alert-container');
    const children = document.createElement('div');
    children.innerHTML= `<div class="alert alert-${messageType} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    element.appendChild(children);
};
