import { PERMISSION_MODULES } from '../constants/permissionModules';

export function toApiValue(value) {
    return value ? 1 : 0;
}

export function createPermissionKey(idUser, moduleId) {
    return `${idUser}-${moduleId}`;
}

export function createPermissionsByModule(activeModules = []) {
    const activeSet = new Set(activeModules.map(Number));

    return PERMISSION_MODULES.reduce((permissions, module) => {
        permissions[module.id] = activeSet.has(module.id);
        return permissions;
    }, {});
}

export function createInitialModuleSelections() {
    return PERMISSION_MODULES.reduce((selections, module) => {
        selections[module.id] = false;
        return selections;
    }, {});
}

export function normalizeUserPermission(user) {
    const activeModules = Array.isArray(user?.activeModules) ? user.activeModules : [];

    return {
        idUser: user.idUser,
        name: user.name,
        value: activeModules.length === PERMISSION_MODULES.length,
        activeModules,
        permissions: createPermissionsByModule(activeModules)
    };
}
