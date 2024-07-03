export const calculateComision = (estudiantes_curso_abierto) => {
    const totalComisionByVendedor = {};
    let totalComisionAllVendedores = 0;

    if (Array.isArray(estudiantes_curso_abierto)) {
        estudiantes_curso_abierto.forEach(estudiante => {
            const { miembro_vendedor, comision_vendedor, precio, moneda } = estudiante;
            if (miembro_vendedor && comision_vendedor !== null && precio !== null && moneda) {
                if (!totalComisionByVendedor[miembro_vendedor]) {
                    totalComisionByVendedor[miembro_vendedor] = { totalPrecio: 0, totalComision: 0, moneda };
                }
                totalComisionByVendedor[miembro_vendedor].totalPrecio += precio;
                totalComisionByVendedor[miembro_vendedor].totalComision += (precio * comision_vendedor / 100);
            }
        });

        totalComisionAllVendedores = Object.values(totalComisionByVendedor).reduce((acc, vendor) => acc + vendor.totalComision, 0);
    }

    return { totalComisionByVendedor, totalComisionAllVendedores };
};

export const calculateCostoAdmin = (estudiantes_curso_abierto, adminCostPercentage) => {
    const totalCostoAdminPorPartner = {};
    let totalCostoAdmin = 0;

    if (Array.isArray(estudiantes_curso_abierto)) {
        estudiantes_curso_abierto.forEach(estudiante => {
            const { partner_vendedor, precio, moneda } = estudiante;
            if (partner_vendedor && precio !== null && moneda) {
                if (!totalCostoAdminPorPartner[partner_vendedor]) {
                    totalCostoAdminPorPartner[partner_vendedor] = { totalCosto: 0, moneda };
                }
                totalCostoAdminPorPartner[partner_vendedor].totalCosto += precio * adminCostPercentage;
            }
        });

        totalCostoAdmin = Object.values(totalCostoAdminPorPartner).reduce((acc, vendor) => acc + vendor.totalCosto, 0);
    }

    return { totalCostoAdminPorPartner, totalCostoAdmin };
};

export const calculateTotalPrecios = (estudiantes_curso_abierto) => {
    const totalPrecioByVendedor = {};
    let totalPrecioAllVendedores = 0;

    if (Array.isArray(estudiantes_curso_abierto)) {
        estudiantes_curso_abierto.forEach(estudiante => {
            const { miembro_vendedor, precio } = estudiante;
            if (miembro_vendedor && precio !== null) {
                totalPrecioByVendedor[miembro_vendedor] = (totalPrecioByVendedor[miembro_vendedor] || 0) + precio;
            }
        });

        totalPrecioAllVendedores = Object.values(totalPrecioByVendedor).reduce((acc, precio) => acc + precio, 0);
    }

    return { totalPrecioByVendedor, totalPrecioAllVendedores };
};