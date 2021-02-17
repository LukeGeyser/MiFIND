// LOCAL IMPORTS
const perms = require('./permissions');

const userBasicPermissions = [
    perms.Login,
    perms.ChangePassword,
    perms.GetGroups,
    perms.GetAllSensors,
    perms.GetAllDevicesForUser,
    perms.GetSingleDevice,
    perms.RefreshToken,
    perms.GetPermissionForUser,
    perms.GetAllUserPermissionIndexes,
    perms.AddDevice,
];

module.exports = {
    userBasicPermissions,
};