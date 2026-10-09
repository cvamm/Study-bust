import SubjectNotesSection from "@/components/SubjectNotesSection";

interface PhysicsNotesSectionProps {
  initialChapterNum?: number;
  lockChapter?: boolean;
  defaultOpen?: boolean;
}

export default function PhysicsNotesSection({
  initialChapterNum,
  lockChapter = false,
  defaultOpen = true,
}: PhysicsNotesSectionProps) {
  return (
    <SubjectNotesSection
      subjectId="phy"
      initialChapterNum={initialChapterNum}
      lockChapter={lockChapter}
      defaultOpen={defaultOpen}
    />
  );
}
