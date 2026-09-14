import React, { useState } from 'react';
import { TABLE_SCHEMAS } from '../data/phase1Data';
import { Database, Key, Shield, Layers, Repeat, ArrowRight } from 'lucide-react';

export const DatabaseTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>(TABLE_SCHEMAS[1].name); // tasks by default

  const currentTable = TABLE_SCHEMAS.find((t) => t.name === selectedTable) || TABLE_SCHEMAS[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Virtual Recurrence Highlight Banner */}
      <div className="border border-amber-200 bg-amber-50/70 p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950 mb-1">
              Smart Virtual Recurrence Engine (Zero Database Row Explosion)
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-3">
              Traditional task apps create 365 rows in the database for daily recurring tasks, rapidly consuming Supabase disk quotas. TaskFlow solves this with a <strong>virtual recurrence master row</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-950 font-medium">
              <div className="bg-white/80 border border-amber-200 p-3 rounded-md">
                <span className="font-bold block text-amber-900 mb-1">1. Master Row</span>
                Stores recurrence pattern in JSONB (<code>{`{"freq": "daily", "interval": 1}`}</code>)
              </div>
              <div className="bg-white/80 border border-amber-200 p-3 rounded-md">
                <span className="font-bold block text-amber-900 mb-1">2. Runtime Virtualization</span>
                Calendar calculates displayed occurrences dynamically in client memory
              </div>
              <div className="bg-white/80 border border-amber-200 p-3 rounded-md">
                <span className="font-bold block text-amber-900 mb-1">3. Completion Shift</span>
                When completed, records history stamp and increments <code>next_due_date</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Browser */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            PostgreSQL Relational Schema Explorer (10 Production Tables)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Select a table to review its column attributes, primary/foreign keys, indexing strategy, and Row Level Security (RLS) policies.
          </p>

          {/* Table Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {TABLE_SCHEMAS.map((table) => (
              <button
                key={table.name}
                id={`btn-table-${table.name}`}
                onClick={() => setSelectedTable(table.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTable === table.name
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Table Details */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-indigo-700">{currentTable.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {currentTable.columns.length} columns
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{currentTable.description}</p>
            </div>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Column</th>
                  <th className="py-3 px-4">Data Type</th>
                  <th className="py-3 px-4">Nullable</th>
                  <th className="py-3 px-4">Keys & References</th>
                  <th className="py-3 px-4">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {currentTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{col.name}</td>
                    <td className="py-2.5 px-4 font-mono text-indigo-600">{col.type}</td>
                    <td className="py-2.5 px-4">
                      {col.nullable ? (
                        <span className="text-slate-400">YES</span>
                      ) : (
                        <span className="font-bold text-amber-700">NOT NULL</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {col.isPrimary && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 mr-1">
                          <Key className="w-3 h-3" /> PK
                        </span>
                      )}
                      {col.isForeign && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">
                          FK &rarr; {col.references}
                        </span>
                      )}
                      {!col.isPrimary && !col.isForeign && <span className="text-slate-400">-</span>}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indexes & RLS Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-700" />
                Performance Indexes
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-700">
                {currentTable.indexes.map((idx, i) => (
                  <li key={i} className="p-1.5 rounded-md bg-white border border-slate-200">
                    {idx}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Row Level Security (RLS) Policies
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-emerald-900">
                {currentTable.rlsPolicies.map((pol, i) => (
                  <li key={i} className="p-1.5 rounded-md bg-emerald-50/80 border border-emerald-200">
                    {pol}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
