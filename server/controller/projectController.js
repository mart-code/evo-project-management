import prisma from '../configs/prisma.js'
//Create Project
export const createProject = async(req, res)=>{
    try {
        const {userId} = await req.auth();
        const {workspaceId, description, name, status, start_date, end_date, team_members, team_lead, progress, priority} = await req.body();
        
        //Check if user has admin role for workspace
        const workspace = await prisma.workspace.findUnique({
            where: {id: workspaceId},
            include: {members: {include: {user: true}}}
        })

        if(!workspace){
            return res.status(404).json({message: 'Workspace not found'});
        }
        if(!workspace.members.some((members)=>members.userId === userID && members.role === 'ADMIN')){
            return res.status(404).json({message: 'You do not have permission to create projects in this workspace'})
        }

        //Get Team Lead using email
        const teamLead = await prisma.user.findUnique({
            where: {email: team_lead},
            select: {id: true}
        })

        const project = await prisma.project.create({
            data: {
                workspaceId, 
                name,
                description,
                status,
                priority,
                progress, 
                team_lead: teamLead?.id,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date): null,
            }
        })
        //Add members to project if they are in the workspace

        if(team_members?.length > 0){
            const membersToAdd = [];
            workspace.members.forEach(member => {
                if(team_members.includes(member.user.email)){
                    membersToAdd.push(member.user.id)
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
    }
}

//Update Project
export const updateProject = async(req, res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
    }
}

//Add member to Project
export const addMember = async(req, res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
    }
}