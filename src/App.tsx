import React, { useState, useEffect } from 'react';
import { useAppData } from './lib/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { DsaTracker } from './components/DsaTracker';
import { AptitudeTracker } from './components/AptitudeTracker';
import { AcademicTracker } from './components/AcademicTracker';
import { InternshipsTracker } from './components/InternshipsTracker';
import { ProjectsTracker } from './components/ProjectsTracker';
import { MistakesLog } from './components/MistakesLog';
import { CoursesTracker } from './components/CoursesTracker';
import { ProductivityDashboard } from './components/ProductivityDashboard';
import { AiMentorChat } from './components/AiMentorChat';
import { AiStudyPlanner } from './components/AiStudyPlanner';
import { LinkedinChecklist } from './components/LinkedinChecklist';
import { ProfileModal } from './components/ProfileModal';
import { SupabaseModal } from './components/SupabaseModal';
import { TabType } from './types';

export default function App() {
  const {
    profile,
    updateProfile,
    dsaList,
    toggleDsaComplete,
    addDsaTopic,
    aptitudeList,
    toggleAptitudeComplete,
    updateAptitudePractice,
    cgpaRecords,
    addCgpaRecord,
    deleteCgpaRecord,
    calculateCGPA,
    examPlanners,
    addExamPlanner,
    toggleRevisionItem,
    coreSubjects,
    updateCoreSubject,
    toggleCoreTopic,
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    projects,
    addProject,
    deleteProject,
    mistakesLog,
    addMistakeLog,
    toggleMistakeResolved,
    deleteMistake,
    externalCourses,
    addExternalCourse,
    deleteExternalCourse,
    studySessions,
    addStudySession,
    linkedinTasks,
    toggleLinkedInTask,
    quotes,
    toggleQuoteFavorite,
    resetToSampleData,
  } = useAppData();

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState<boolean>(false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleStartPomodoro = () => {
    setActiveTab('productivity');
  };

  // Badge counts for sidebar
  const counts = {
    dsaPending: dsaList.filter((d) => !d.completed).length,
    aptitudePending: aptitudeList.filter((a) => !a.completed).length,
    upcomingExams: examPlanners.filter((e) => e.status === 'Upcoming').length,
    activeInternships: internships.filter((a) => a.status !== 'Rejected').length,
    projectsCount: projects.length,
    unresolvedMistakes: mistakesLog.filter((m) => !m.resolved).length,
  };

  const cgpaInfo = calculateCGPA();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#212A31] text-[#D3D9D4]' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Sticky Navigation */}
      <Navbar
        profile={profile}
        streakCount={profile.streakCount || 12}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAiMentor={() => setActiveTab('ai-mentor')}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenTimer={() => setActiveTab('productivity')}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        pomodoroActive={false}
        pomodoroTimeFormatted="25:00"
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isDark={isDark}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          counts={counts}
          profile={profile}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {activeTab === 'overview' && (
            <OverviewDashboard
              profile={profile}
              quotes={quotes}
              onToggleFavoriteQuote={toggleQuoteFavorite}
              dsaList={dsaList}
              aptitudeList={aptitudeList}
              cgpaInfo={cgpaInfo}
              examPlanners={examPlanners}
              applications={internships}
              projects={projects}
              mistakes={mistakesLog}
              onSelectTab={setActiveTab}
              onStartPomodoro={handleStartPomodoro}
              isDark={isDark}
            />
          )}

          {activeTab === 'dsa' && (
            <DsaTracker
              dsaList={dsaList}
              onToggleComplete={toggleDsaComplete}
              onAddTopic={addDsaTopic}
              profile={profile}
              onUpdateProfile={updateProfile}
              isDark={isDark}
            />
          )}

          {activeTab === 'aptitude' && (
            <AptitudeTracker
              aptitudeList={aptitudeList}
              onToggleComplete={toggleAptitudeComplete}
              onUpdatePractice={updateAptitudePractice}
              isDark={isDark}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicTracker
              cgpaRecords={cgpaRecords}
              onAddCgpaRecord={addCgpaRecord}
              onDeleteCgpaRecord={deleteCgpaRecord}
              calculateCGPA={calculateCGPA}
              examPlanners={examPlanners}
              onAddExamPlanner={addExamPlanner}
              onToggleRevisionItem={toggleRevisionItem}
              coreSubjects={coreSubjects}
              onUpdateCoreSubject={updateCoreSubject}
              onToggleCoreTopic={toggleCoreTopic}
              isDark={isDark}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsTracker
              applications={internships}
              onAddApplication={addInternship}
              onUpdateStatus={(id, status) => updateInternship(id, { status })}
              onDeleteApplication={deleteInternship}
              isDark={isDark}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTracker
              projects={projects}
              onAddProject={addProject}
              onDeleteProject={deleteProject}
              isDark={isDark}
            />
          )}

          {activeTab === 'mistakes' && (
            <MistakesLog
              mistakes={mistakesLog}
              onAddMistake={addMistakeLog}
              onToggleResolve={toggleMistakeResolved}
              onDeleteMistake={deleteMistake}
              isDark={isDark}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTracker
              courses={externalCourses}
              onAddCourse={addExternalCourse}
              onUpdateProgress={() => {}}
              onDeleteCourse={deleteExternalCourse}
              isDark={isDark}
            />
          )}

          {activeTab === 'productivity' && (
            <ProductivityDashboard
              sessions={studySessions}
              onAddSession={addStudySession}
              isDark={isDark}
            />
          )}

          {activeTab === 'ai-mentor' && (
            <AiMentorChat profile={profile} isDark={isDark} />
          )}

          {activeTab === 'ai-planner' && (
            <AiStudyPlanner isDark={isDark} />
          )}

          {activeTab === 'linkedin' && (
            <LinkedinChecklist
              tasks={linkedinTasks}
              onToggleTask={toggleLinkedInTask}
              isDark={isDark}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ProfileModal
        profile={profile}
        onUpdateProfile={updateProfile}
        onResetData={resetToSampleData}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isDark={isDark}
      />

      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
