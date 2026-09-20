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
  bool _isBreak = false;
  Timer? _timer;

  void _startTimer() {
    setState(() => _isRunning = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
      } else {
        _timer?.cancel();
        setState(() {
          _isRunning = false;
          _isBreak = !_isBreak;
          _remainingSeconds = _isBreak ? breakDuration : focusDuration;
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
      _remainingSeconds = _isBreak ? breakDuration : focusDuration;
    });
  }

  String _formatTime(int totalSeconds) {
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
    final totalDuration = _isBreak ? breakDuration : focusDuration;
    final progress = 1.0 - (_remainingSeconds / totalDuration);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('Pomodoro Focus', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: _isBreak ? const Color(0xFF10B981).withOpacity(0.2) : const Color(0xFF6366F1).withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                _isBreak ? '☕ SHORT BREAK' : '🎯 DEEP WORK SESSION',
                style: TextStyle(
                  color: _isBreak ? const Color(0xFF34D399) : const Color(0xFFA5B4FC),
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 36),

            // Circular Progress Indicator & Countdown
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 240,
                  height: 240,
                  child: CircularProgressIndicator(
                    value: progress,
                    strokeWidth: 10,
                    backgroundColor: Colors.white12,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _isBreak ? const Color(0xFF10B981) : const Color(0xFF6366F1),
                    ),
                  ),
                ),
                Text(
                  _formatTime(_remainingSeconds),
                  style: const TextStyle(
                    fontSize: 56,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontFamily: 'monospace',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 48),

            // Controls
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  iconSize: 32,
                  icon: const Icon(Icons.refresh, color: Colors.white60),
                  onPressed: _resetTimer,
                ),
                const SizedBox(width: 24),
                FloatingActionButton.large(
                  backgroundColor: const Color(0xFF6366F1),
                  onPressed: _isRunning ? _pauseTimer : _startTimer,
                  child: Icon(_isRunning ? Icons.pause : Icons.play_arrow, size: 40, color: Colors.white),
                ),
                const SizedBox(width: 24),
                IconButton(
                  iconSize: 32,
                  icon: const Icon(Icons.skip_next, color: Colors.white60),
                  onPressed: () {
                    _timer?.cancel();
                    setState(() {
                      _isRunning = false;
                      _isBreak = !_isBreak;
                      _remainingSeconds = _isBreak ? breakDuration : focusDuration;
                    });
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
