

export function RecentActivity({ activities } : { activities: any[] }) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                {activity.user?.charAt(0)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {activity.user}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activity.action}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}