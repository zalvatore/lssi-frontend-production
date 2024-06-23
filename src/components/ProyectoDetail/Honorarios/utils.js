export const calculateComision = (props) => {
    const { 
        estudiantes_curso_abierto, 
        totalCostoInstructores, 
        partidaCosto,
        admin_total_cost,
        total_cost_proyect_con_causa 
    } = props;
    const { utilidad_lssi } = calculateUtilidades(props) || {};

    if (typeof utilidad_lssi !== 'number') {
        return { totalComissionByVendor: {}, totalUtilidadByAllVendors: 0 }; 
    }

    if (!Array.isArray(estudiantes_curso_abierto) || estudiantes_curso_abierto.length === 0) {
        return { totalComissionByVendor: {}, totalUtilidadByAllVendors: 0 };
    }

    const totalComissionByVendor = {};
    let totalSalesByAllVendors = 0;
    let totalUtilidadByAllVendors = 0;
    let totalLineItemCount = 0;

    estudiantes_curso_abierto.forEach(({ partner_vendedor, precio, moneda, comision_vendedor }) => {
        if (partner_vendedor && precio && moneda) {
            if (!totalComissionByVendor[partner_vendedor]) {
                totalComissionByVendor[partner_vendedor] = { 
                    totalPrecio: 0, 
                    moneda, 
                    lineitemcount: 0,
                    costoInstructores: 0,
                    totalComission: 0,
                    Calculated_profit_by_vendor: 0,
                };
            }
            const vendorData = totalComissionByVendor[partner_vendedor];
            vendorData.totalPrecio += precio;
            vendorData.totalComission += (precio * comision_vendedor / 100);
            vendorData.lineitemcount += 1;
            totalSalesByAllVendors += precio;
            totalLineItemCount += 1;
        }
    });

    if (totalSalesByAllVendors === 0 || totalLineItemCount === 0) {
        return { totalComissionByVendor, totalUtilidadByAllVendors };
    }

    Object.entries(totalComissionByVendor).forEach(([vendor, vendorData]) => {
        const { totalPrecio, lineitemcount } = vendorData;
        const proportion = totalPrecio / totalSalesByAllVendors;
        vendorData.proportion = proportion;
        vendorData.utilidad = proportion * 0.5 * utilidad_lssi;
        totalUtilidadByAllVendors += vendorData.utilidad;

        vendorData.costoInstructores = (totalCostoInstructores / totalLineItemCount) * lineitemcount;
        vendorData.costoPartidas = (partidaCosto / totalLineItemCount) * lineitemcount;
        vendorData.admin_total_cost = admin_total_cost * proportion;
        vendorData.total_cost_proyect_con_causa = total_cost_proyect_con_causa * proportion;

        vendorData.Calculated_profit_by_vendor = totalPrecio 
            - vendorData.totalComission 
            - vendorData.costoInstructores 
            - vendorData.costoPartidas 
            - vendorData.admin_total_cost 
            - vendorData.total_cost_proyect_con_causa;
    });

    return { totalComissionByVendor, totalUtilidadByAllVendors };
};

export const calculateUtilidades = (props) => {
    const lider = props.proyectoLider;
    let utilidad_lssi;
    let utilidad_Europa;
    let utilidad_Latam;

    if (lider === 'LSSI Europa') {
        utilidad_lssi = props.utilidad * 0.5;
        utilidad_Europa = props.utilidad * 0.5;
        utilidad_Latam = null;
    } else if (lider === 'Paola Cruz' || lider === 'LSSI LATAM') {
        utilidad_lssi = props.utilidad * 0.75;
        utilidad_Europa = null;
        utilidad_Latam = props.utilidad * 0.25;
    } else {
        utilidad_lssi = props.utilidad; 
        utilidad_Europa = null;
        utilidad_Latam = null;
    }
    
    return { utilidad_lssi, utilidad_Europa, utilidad_Latam };
};