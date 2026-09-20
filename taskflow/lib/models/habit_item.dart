class HabitItem {
  String id;
  String title;
  String icon;
  int streak;
  bool isCompletedToday;

  HabitItem({
    required this.id,
    required this.title,
    required this.icon,
    this.streak = 0,
    this.isCompletedToday = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'icon': icon,
    'streak': streak,
    'isCompletedToday': isCompletedToday,
  };

  factory HabitItem.fromJson(Map<String, dynamic> json) => HabitItem(
    id: json['id'] as String,
    title: json['title'] as String,
    icon: json['icon'] as String? ?? '⚡',
    streak: json['streak'] as int? ?? 0,
    isCompletedToday: json['isCompletedToday'] as bool? ?? false,
  );
}
