import 'dart:async';
import 'package:flutter/material.dart';

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({super.key});

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  static const int focusDuration = 25 * 60;
  static const int breakDuration = 5 * 60;

  int _remainingSeconds = focusDuration;
  bool _isRunning = false;
  String _mode = 'focus'; // 'focus' | 'break'
  String _selectedSound = 'Rainfall';
  Timer? _timer;

  void _startTimer() {
    _timer?.cancel();
    setState(() => _isRunning = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
      } else {
        _timer?.cancel();
        setState(() {
          _isRunning = false;
          _mode = _mode == 'focus' ? 'break' : 'focus';
          _remainingSeconds = _mode == 'focus' ? focusDuration : breakDuration;
        });
      }
    });
  }

  void _pauseTimer() {
    _timer?.cancel();
    setState(() => _isRunning = false);
  }

  void _resetTimer() {
    _timer?.cancel();
    setState(() {
      _isRunning = false;
      _remainingSeconds = _mode == 'focus' ? focusDuration : breakDuration;
    });
  }

  void _switchMode(String newMode) {
    _timer?.cancel();
    setState(() {
      _mode = newMode;
      _isRunning = false;
      _remainingSeconds = newMode == 'focus' ? focusDuration : breakDuration;
    });
  }

  String _formatTimer(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 10),

          // Mode Selector Switch (Focus 25m vs Break 5m)
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFFE2E8F0),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                GestureDetector(
                  onTap: () => _switchMode('focus'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: _mode == 'focus' ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: _mode == 'focus'
                          ? [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 4)]
                          : null,
                    ),
                    child: Text(
                      'Focus (25m)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _mode == 'focus' ? const Color(0xFF4338CA) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () => _switchMode('break'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: _mode == 'break' ? Colors.white : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: _mode == 'break'
                          ? [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 4)]
                          : null,
                    ),
                    child: Text(
                      'Break (5m)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _mode == 'break' ? const Color(0xFF4338CA) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 36),

          // Circular Timer Display matching Simulator
          Container(
            width: 180,
            height: 180,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF4F46E5), width: 4),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(10),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _formatTimer(_remainingSeconds),
                  style: const TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _isRunning ? 'Deep Focus Active' : 'Paused',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                    color: Color(0xFF4F46E5),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Controls (Start / Pause / Reset)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF4F46E5),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                ),
                onPressed: () {
                  if (_isRunning) {
                    _pauseTimer();
                  } else {
                    _startTimer();
                  }
                },
                icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow, color: Colors.white, size: 18),
                label: Text(
                  _isRunning ? 'Pause' : 'Start Focus',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
              const SizedBox(width: 12),
              InkWell(
                onTap: _resetTimer,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.rotate_left, color: Color(0xFF334155), size: 20),
                ),
              ),
            ],
          ),
          const SizedBox(height: 36),

          // Ambient Soundscape Selector matching Live Simulator
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.volume_up, size: 16, color: Color(0xFF4F46E5)),
                        SizedBox(width: 6),
                        Text(
                          'Ambient Soundscape',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                        ),
                      ],
                    ),
                    Text(
                      _selectedSound,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: ['Rainfall', 'White Noise', 'Forest', 'Mute'].map((sound) {
                    final isSelected = _selectedSound == sound;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedSound = sound),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          padding: const EdgeInsets.symmetric(vertical: 7),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFFEEF2FF) : const Color(0xFFF8FAFC),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF4F46E5) : const Color(0xFFE2E8F0),
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            sound,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: isSelected ? const Color(0xFF4338CA) : const Color(0xFF475569),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
