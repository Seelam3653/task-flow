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
          const Icon(Icons.workspace_premium, color: Color(0xFFF59E0B), size: 48),
          const SizedBox(height: 8),
          const Text('Upgrade to TaskFlow Pro', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text(
            'Unlock AI subtask decomposition, unlimited habits, and priority focus sounds.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFF6366F1), width: 2),
              borderRadius: BorderRadius.circular(14),
              color: const Color(0xFF6366F1).withOpacity(0.15),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Text('Annual Plan (Save 33%)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                Text(r'$39.99 / year', style: TextStyle(color: Color(0xFFA5B4FC), fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Pro features unlocked!')),
                );
              },
              child: const Text('Start 7-Day Free Trial', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}
