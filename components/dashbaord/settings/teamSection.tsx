import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface TeamMember {
    id: string;
    name: string;
    user_email: string;
    image?: string;
    role?: string;
    status?: string;
}

const TeamSection = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newMemeberEmail, setNewMemberEmail] = useState("");
    const [newMemeberName, setNewMemberName] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await fetch("/api/team/fetch");
            if(response.ok) {
                const data = await response.json();
                setTeam(data.team);
                setIsLoading(false);
            }
            
        } catch (error) {
            console.error("Failed to fetch team members", error);
            toast.error("Failed to fetch team members");
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddMember = async () => {
      if(!newMemeberEmail) return;
      setIsAdding(true)

      try{
        const res = await fetch("/api/team/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newMemeberEmail,
            name: newMemeberName,
          })
        })

        if(res.ok) {
          toast.success("Member added successfully");
          setOpenDialog(false);
          setNewMemberEmail("");
          setNewMemberName("");
          fetchTeam();
        } else {
          const data = await res.json();
          toast.error(data.error);
        }

      }catch(error) {
        console.error("Failed to add team member", error);
        toast.error("Failed to add team member");
      } finally {
        setIsAdding(false);
      }
    }

    
  return (
    <Card className='border-white/5 bg-[#0A0A0E]'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='text-base font-medium text-white'>
            Team Members
          </CardTitle>
          <CardDescription>
            Manage your team and there access
          </CardDescription>
        </div>
        <Dialog
          open={openDialog}
          onOpenChange={setOpenDialog}
        >
          <DialogTrigger asChild>
            <Button size="sm" className='bg-white text-black hover:bg-zinc-200'>
              <Plus className='w-4 h-4 mr-2' />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0E] border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to your organization
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-4'>
                <Label htmlFor='name' className="text-zinc-300">
                  Name
                </Label>
                <Input
                  id='name'
                  placeholder='Abraham Iroot'
                  value={newMemeberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className='bg-white/5 border-white/10 text-white'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email' className='text-zinc-300'>Email</Label>
                <Input
                  id='email'
                  placeholder='insightForge@gmail.com'
                  value={newMemeberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className='bg-white/5 border-white/10 text-white'
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className='border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                >
                  Cancel
                </Button>
                <Button
                  disabled={isAdding}
                  onClick={handleAddMember}
                  className='bg-white text-black hover:bg-zinc-200 '
                >
                  {isAdding ? "Adding..." : "Add Member"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>

        </Dialog>
      </CardHeader>
    </Card>
  )
}

export default TeamSection