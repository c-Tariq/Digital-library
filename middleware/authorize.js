// Define role permissions
const rolePermissions = {
  admin: {
    books: ["create", "read", "update", "delete"],
    authors: ["create", "read", "update", "delete"],
    categories: ["create", "read", "update", "delete"],
    publishers: ["create", "read", "update", "delete"],
  },
  editor: {
    books: ["create", "read", "update"],
    authors: ["create", "read", "update"],
    categories: ["create", "read", "update"],
    publishers: ["create", "read", "update"],
  },
  viewer: {
    books: ["read"],
    authors: ["read"],
    categories: ["read"],
    publishers: ["read"],
  },
};

// Check if user can perform action on resource
function can(resource, action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const roleName = req.user.role_name;
    const permissions = rolePermissions[roleName];

    if (!permissions) {
      return res.status(403).json({ error: "Invalid role" });
    }

    const resourcePermissions = permissions[resource] || [];

    if (!resourcePermissions.includes(action)) {
      return res.status(403).json({
        error: `You don't have permission to ${action} ${resource}`,
      });
    }

    next();
  };
}

// Convenience functions
const canCreate = (resource) => can(resource, "create");
const canRead = (resource) => can(resource, "read");
const canUpdate = (resource) => can(resource, "update");
const canDelete = (resource) => can(resource, "delete");

module.exports = {
  can,
  canCreate,
  canRead,
  canUpdate,
  canDelete,
};
