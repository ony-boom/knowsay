import { getChallengeById } from "@/lib/actions/get-challenge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getChallengeParticipants,
  type ChallengeParticipant,
} from "@/lib/actions/get-challenge-participants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Team = {
  name: string;
  created: string;
  members: Array<{
    initials: string;
  }>;
};

// Atomic Components
const ChallengeNotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
    <div className="bg-muted rounded-lg p-8 text-center shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight">
        Challenge Not Found
      </h2>
      <p className="text-muted-foreground mt-2">
        The challenge you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link
        href="/home/challenge"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        Back to Challenges
      </Link>
    </div>
  </div>
);

type HeaderProps = {
  isTeamBased: boolean;
};

const ManageParticipantsPageHeader: React.FC<HeaderProps> = ({
  isTeamBased,
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <hgroup className="space-y-2 md:space-y-4">
      <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
        Manage Participants
      </h1>
      <p className="text-foreground/80 text-base md:text-lg">
        {isTeamBased
          ? "Manage teams and participants in your team-based challenge."
          : "Invite and manage individual participants for your challenge."}
      </p>
    </hgroup>

    <ActionButtons isTeamBased={isTeamBased} />
  </div>
);

type ActionButtonsProps = {
  isTeamBased: boolean;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ isTeamBased }) => (
  <div className="flex flex-wrap gap-2">
    <InviteParticipantsDialog />
    {isTeamBased && <CreateTeamDialog />}
  </div>
);

const InviteParticipantsDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="gap-2">
        <UserPlus className="h-4 w-4" />
        Invite Participants
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite Participants</DialogTitle>
        <DialogDescription>
          Send invitation emails to participants for this challenge.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="emails">Email Addresses</Label>
          <Input
            id="emails"
            placeholder="Enter email addresses separated by commas"
          />
          <p className="text-muted-foreground text-sm">
            Participants will receive an email with instructions to join.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="gap-2">
          <Mail className="h-4 w-4" />
          Send Invitations
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const CreateTeamDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        Create Team
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogDescription>Add a new team to your challenge.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="team-name">Team Name</Label>
          <Input id="team-name" placeholder="Enter team name" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="gap-2">
          <Users className="h-4 w-4" />
          Create Team
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const SearchBar = () => (
  <div className="flex justify-start">
    <div className="relative w-full max-w-sm">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search participants or teams..."
        className="pl-8"
      />
    </div>
  </div>
);

type TeamListProps = {
  teams: Team[];
};

const TeamList: React.FC<TeamListProps> = ({ teams }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>Teams</CardTitle>
      <CardDescription>
        Manage the teams participating in this challenge.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>
                <div className="flex -space-x-2 overflow-hidden">
                  {team.members.map((member, idx) => (
                    <Avatar
                      key={idx}
                      className="border-background h-8 w-8 border-2"
                    >
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </TableCell>
              <TableCell>{team.created}</TableCell>
              <TableCell>
                <TeamActions />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const TeamActions = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>View Details</DropdownMenuItem>
      <DropdownMenuItem>Add Members</DropdownMenuItem>
      <DropdownMenuItem className="text-destructive">
        Delete Team
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

type ParticipantListProps = {
  participants: ChallengeParticipant[];
  isTeamBased: boolean;
};

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  isTeamBased,
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>{isTeamBased ? "All Participants" : "Participants"}</CardTitle>
      <CardDescription>
        {isTeamBased
          ? "View all participants across all teams."
          : "Manage individual participants in this challenge."}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {isTeamBased ? (
              <>
                <TableHead>Team</TableHead>
                <TableHead>Role</TableHead>
              </>
            ) : (
              <>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </>
            )}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => {
            // Get initials from full name
            const initials = participant.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()
              .substring(0, 2);

            // Format date for display
            const joinedDate = participant.joined_at
              ? new Date(participant.joined_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "-";

            return (
              <TableRow key={participant.invitation_id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span>{participant.name || "Unnamed"}</span>
                </TableCell>
                <TableCell>{participant.email}</TableCell>
                {isTeamBased ? (
                  <>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Badge variant="outline">{participant.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <ParticipantTeamActions />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <Badge
                        className={
                          participant.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {participant.status === "active" ? "Active" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{joinedDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const ParticipantTeamActions = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Change Team</DropdownMenuItem>
      <DropdownMenuItem>Promote/Demote</DropdownMenuItem>
      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Main Component
export default async function ManageParticipantsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    return <ChallengeNotFound />;
  }

  // Fetch real participant data using the server action
  const { participants, isTeamBased } = await getChallengeParticipants(id);

  // Mock teams data for now (would need a separate server action for teams)
  const mockTeams: Team[] = [
    {
      name: "Team Alpha",
      created: "Feb 20, 2023",
      members: [{ initials: "JD" }, { initials: "TS" }, { initials: "+2" }],
    },
    {
      name: "Code Warriors",
      created: "Feb 22, 2023",
      members: [{ initials: "MK" }, { initials: "AL" }],
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pt-0 md:px-6 md:py-8">
      <ManageParticipantsPageHeader isTeamBased={isTeamBased} />
      <SearchBar />

      {isTeamBased ? (
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="participants">All Participants</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="mt-4">
            <TeamList teams={mockTeams} />
          </TabsContent>

          <TabsContent value="participants" className="mt-4">
            <ParticipantList participants={participants} isTeamBased={true} />
          </TabsContent>
        </Tabs>
      ) : (
        <ParticipantList participants={participants} isTeamBased={false} />
      )}
    </div>
  );
}
