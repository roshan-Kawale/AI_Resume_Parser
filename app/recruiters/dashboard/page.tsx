"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, UserIcon, SearchIcon, PlusIcon, StarIcon, CheckIcon, XIcon } from "lucide-react";
import type { Candidate, JobDescription } from "@/app/types";
import { toast } from "sonner";

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isViewingProfile, setIsViewingProfile] = useState(false);

  const handlePostJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          requiredSkills: formData.get("requiredSkills")?.toString().split(",").map(s => s.trim()),
          experience: formData.get("experience"),
          education: formData.get("education"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to post job");
      
      const data = await response.json();
      setJobs([...jobs, data.job]);
      setIsPostingJob(false);
      toast.success("Job posted successfully");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job");
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/candidates/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search candidates");
    }
  };

  const handleStatusUpdate = async (candidateId: string, status: 'shortlisted' | 'rejected') => {
    try {
      const response = await fetch("/api/candidates/status", {
        method: "PUT",
        body: JSON.stringify({ candidateId, status }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update status");

      setCandidates(candidates.map(c => 
        c.id === candidateId ? { ...c, status } : c
      ));

      toast.success(`Candidate ${status === 'shortlisted' ? 'shortlisted' : 'rejected'} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update candidate status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <Dialog open={isPostingJob} onOpenChange={setIsPostingJob}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <Input name="title" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea name="description" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Required Skills</label>
                  <Input name="requiredSkills" placeholder="React, Node.js, TypeScript" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience Required</label>
                  <Input name="experience" placeholder="3+ years" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Education</label>
                  <Input name="education" placeholder="Bachelor's in Computer Science or equivalent" required />
                </div>
                <Button type="submit" className="w-full">Post Job</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search candidates by skills, experience, or education..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="candidates">
          <TabsList className="mb-6">
            <TabsTrigger value="candidates">
              <UserIcon className="w-4 h-4 mr-2" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <BriefcaseIcon className="w-4 h-4 mr-2" />
              Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates">
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          {candidate.relevanceScore}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            candidate.status === 'shortlisted'
                              ? 'success'
                              : candidate.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {candidate.status || 'New'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog open={isViewingProfile && selectedCandidate?.id === candidate.id} 
                                 onOpenChange={(open) => {
                                   setIsViewingProfile(open);
                                   if (!open) setSelectedCandidate(null);
                                 }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCandidate(candidate)}
                              >
                                View Profile
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Candidate Profile</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold">Contact Information</h3>
                                  <p>Email: {candidate.email}</p>
                                  <p>LinkedIn: <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{candidate.linkedinUrl}</a></p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Skills</h3>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.skills.map((skill) => (
                                      <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Experience</h3>
                                  <p>{candidate.experience}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">Education</h3>
                                  <p>{candidate.education}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">AI Summary</h3>
                                  <p>{candidate.aiSummary}</p>
                                </div>
                                {candidate.missingSkills && candidate.missingSkills.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold">Suggested Improvements</h3>
                                    <ul className="list-disc pl-4">
                                      {candidate.missingSkills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleStatusUpdate(candidate.id, 'shortlisted')}
                            disabled={candidate.status === 'shortlisted'}
                          >
                            <CheckIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleStatusUpdate(candidate.id, 'rejected')}
                            disabled={candidate.status === 'rejected'}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Required Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Matches</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="font-medium">{job.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {job.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{job.experience}</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" onClick={() => handleSearch(job.title)}>
                          Find Matches
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}