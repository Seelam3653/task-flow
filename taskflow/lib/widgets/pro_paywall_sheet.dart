import 'package:flutter/material.dart';

class ProPaywallSheet extends StatelessWidget {
  const ProPaywallSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Color(0xFF0F172A),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Container(
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 18),

          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFF59E0B).withAlpha(40),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.workspace_premium, color: Color(0xFFFCD34D), size: 24),
          ),
          const SizedBox(height: 10),
          const Text(
            'TaskFlow Pro',
            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 4),
          const Text(
            'Supercharge productivity with unlimited AI decomposition and offline multi-device sync.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 11),
          ),
          const SizedBox(height: 20),

          // Feature checkmarks
          Column(
            children: [
              _buildFeatureRow('Unlimited Gemini AI Subtask Breakdowns'),
              const SizedBox(height: 8),
              _buildFeatureRow('Instant 2-way Cloud SQLite Synchronization'),
              const SizedBox(height: 8),
              _buildFeatureRow('Cognitive Workload & Burnout Guard'),
            ],
          ),
          const SizedBox(height: 20),

          // Annual Plan Button
          Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFF59E0B), Color(0xFFEA580C)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Subscribed to TaskFlow Pro Annual!')),
                );
              },
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Annual Plan (Save 33%)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                  Text(r'$39.99 / year', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Monthly Plan Button
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('🎉 Subscribed to TaskFlow Pro Monthly!')),
                );
              },
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Monthly Plan', style: TextStyle(color: Color(0xFFE2E8F0), fontWeight: FontWeight.w600, fontSize: 12)),
                  Text(r'$4.99 / mo', style: TextStyle(color: Color(0xFFE2E8F0), fontWeight: FontWeight.w600, fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Back to Free Version',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, decoration: TextDecoration.underline),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(String label) {
    return Row(
      children: [
        const Icon(Icons.check, size: 14, color: Color(0xFF34D399)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 11),
          ),
        ),
      ],
    );
  }
}
