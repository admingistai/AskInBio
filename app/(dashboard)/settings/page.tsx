export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Settings
      </h1>
      
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Profile Settings
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Profile settings will be implemented here
          </p>
        </div>
        
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Theme Settings
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Theme customization will be implemented here
          </p>
        </div>
      </div>
    </div>
  )
}