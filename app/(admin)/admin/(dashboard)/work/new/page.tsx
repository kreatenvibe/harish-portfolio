import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = {
  title: "New Project",
};

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">
        New Project
      </h1>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
