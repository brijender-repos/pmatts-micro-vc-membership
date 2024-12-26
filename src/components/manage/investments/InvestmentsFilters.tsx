import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvestmentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  projects?: { name: string }[];
  pageSize: number;
  onPageSizeChange: (value: number) => void;
}

export function InvestmentsFilters({
  searchTerm,
  onSearchChange,
  selectedProject,
  onProjectChange,
  projects,
  pageSize,
  onPageSizeChange,
}: InvestmentsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-4">
        <Input
          placeholder="Search by investor name, email, or phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedProject} onValueChange={onProjectChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Projects</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.name} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Records per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="100">100 per page</SelectItem>
          <SelectItem value="500">500 per page</SelectItem>
          <SelectItem value="999999">Show all</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}