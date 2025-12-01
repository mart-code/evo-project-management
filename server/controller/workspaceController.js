import prisma from "../configs/prisma";

export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const workspaces = await prisma.workspaceMember.findMany({
      where: {
        members: { some: { userId: userId } },
      },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: { include: { user: true } },
              },
            },
          },
        },
        owner: true
      },
    });
    return res.status(200).json(workspaces);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};


//Add member to workspace

export const addMember = async (req, res) => {
     try {
        const {userId} = await req.auth();
        const {email, role, workspaceId, message} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
             }
        })
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        if(!workspaceId || !role){
            return res.status(400).json({message: "Workspace id and role are required"})
        }
if(!["ADMIN", "MEMBER"].includes(role)){
    return res.status(400).json({message: "Invalid role"})
}     
const workspace = await prisma.workspace.findUnique({
    where: {
        id: workspaceId
    }, include: {
        members: true
    }
})
if(!workspace){
    return res.status(404).json({message: "Workspace not found"})
}

if(!workspace.members.find((member)=> member.userId === userId && member.role === "ADMIN")){
    return res.status(401).json({message: "You don't have admin privileges"})
}

  
const existingMember = workspace.members.find((member)=> member.userId === user.id)
if(existingMember){
    return res.status(400).json({message: "User is already a member of this workspace"})
}

const member = await prisma.workspaceMember.create({
    data: {
        userId: user.id,
        workspaceId: workspaceId,
        role: role,
        message: message
    }
})
return res.status(200).json(member, {message: "Member added successfully"})     } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
     }
}