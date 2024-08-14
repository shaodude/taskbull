# Design considerations
1) firestore database schema. users and tasks separated - firebase pricing! better to combine to reduce number of calls and periodically update database
not scalable as number of tasks = number or reads/ writes
2) syncs with cloud (firebase) every minute
3) add to calendar
4) CRUD actions with tasks
5) Create, edit, delete, restore tasks
6) soft deletes to prevent user error. User can manually restore completed / deleted tasks. Users are also given the option to do a quick undo (5 seconds) after delete action.
7) game element of leveling and exp - daily exp award, task completion award, rank progression chart, user stats log.
8) custom sort function to allow users to sort outstanding tasks by due date, difficulty, and importance. they can further sort based on an ascending or descending order.
9) custom user display name
10) light dark mode
11) response interface with toast for user interactions i.e task creation, task updated, task completed, task deleted 
