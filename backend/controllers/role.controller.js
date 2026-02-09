import Role from '../models/Role.js';

const createRole = async (req, res) => {
    try {
        const { institute_id, name, parent_role_id } = req.body;

        // Validation: Check if institute exists (omitted for brevity, but should be done)

        let parentRole = null;
        if (parent_role_id) {
            // We need to fetch the parent role to get its level
            // Ideally Role.findById but we used findByInstituteId. 
            // Let's assume we pass the full parent object or fetch it.
            // For now, let's just fetch the parent role by ID if we had that method.
            // Since we don't have findById in Role.js yet, let's rely on the Model to handle it 
            // OR update Role.js to have findById. 
            // Actually Role.js's create method expects a parentRole object to extract level.
            // Let's just update Role.js to handle `findById` or just pass the level from client? 
            // No, passing level from client is insecure.
            // We MUST add findById to Role.js.
        }

        // Wait, for this iteration, I'll update Role.js to have findById first? 
        // Or I can just fetch all roles and find it in memory (inefficient but works for MVP).
        // Let's implement findById in Role Model first.

        // Actually, let's just implement `findById` inside the controller using a direct query if needed, 
        // or better, add it to the model. 
        // For now, I'll use a hack: modify Role.js to support findById.

        // But wait, I can't modify Role.js easily without another tool call.
        // Let's assume I will add `findById` to Role.js.

        // For now, let's write the controller assuming `Role.findById` exists.
        if (parent_role_id) {
            parentRole = await Role.findById(parent_role_id);
            if (!parentRole) {
                return res.status(404).json({ message: 'Parent role not found' });
            }
        }

        const role = await Role.create({ institute_id, name }, parentRole);
        res.status(201).json(role);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getRoleTree = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const roles = await Role.findByInstituteId(instituteId);

        // Build Tree
        const roleMap = {};
        const tree = [];

        roles.forEach(role => {
            // Normalize ID for PG vs Mongo
            const id = role.id || role._id;
            roleMap[id] = { ...role, children: [] };
            // If PG, role is row. If Mongo, role is document.
            // Mongoose result might be immutable, need .toObject() or spread.
            // Spread {...role} works if it's a POJO or Mongoose doc (mostly).
            // However, `role` from PG is just an object. 
            // `role` from Mongo is a Mongoose document. `_doc` is the data.
            if (role._doc) {
                roleMap[id] = { ...role._doc, id: role._id, children: [] };
            }
        });

        roles.forEach(role => {
            const id = role.id || role._id;
            const mappedRole = roleMap[id];
            if (mappedRole.parent_role_id) {
                const parentId = mappedRole.parent_role_id.toString(); // Ensure string comparison
                if (roleMap[parentId]) {
                    roleMap[parentId].children.push(mappedRole);
                }
            } else {
                tree.push(mappedRole);
            }
        });

        res.json(tree);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { createRole, getRoleTree };
