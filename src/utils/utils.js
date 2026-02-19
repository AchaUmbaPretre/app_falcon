export const getColorForOperationType = (type) => {
    switch (type) {
        case 'Installation':
            return 'blue';
        case 'Démantèlement':
            return 'red';
        case 'Contrôle technique':
            return 'green';
        case 'Remplacement':
            return 'orange';
        default:
            return 'default';
    }
};