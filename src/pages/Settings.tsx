import React, { useState } from 'react';
import { Users, Store, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { useUsers } from '../features/settings/hooks/useUsers';
import { useStoreProfile } from '../features/settings/hooks/useStoreProfile';
import { UsersTab } from '../features/settings/components/UsersTab';
import { StoreProfileTab } from '../features/settings/components/StoreProfileTab';
import { AccountSecurityTab } from '../features/settings/components/AccountSecurityTab';
import { useAuth } from '../context/AuthContext';

type TabType = 'users' | 'store' | 'account';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');

  const {
    users,
    rawUsers,
    isLoading: isUsersLoading,
    search,
    setSearch,
    refetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
  } = useUsers();

  const {
    store,
    isLoading: isStoreLoading,
    isSaving: isStoreSaving,
    refetchStore,
    updateStore,
  } = useStoreProfile();

  const handleRefresh = () => {
    if (activeTab === 'users') {
      refetchUsers();
    } else if (activeTab === 'store') {
      refetchStore();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                إعدادات المتجر والمستخدمين
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                إدارة طاقم العمل، حسابات الكاشيرين، الصلاحيات وبيانات المتجر وتأمين الحساب
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${(isUsersLoading || isStoreLoading) ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-px overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-px shrink-0 ${
            activeTab === 'users'
              ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>طاقم العمل والمستخدمين</span>
          {rawUsers.length > 0 && (
            <span
              className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {rawUsers.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-px shrink-0 ${
            activeTab === 'store'
              ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>بيانات وإعدادات المتجر</span>
          {store?.taxEnabled && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              ضريبة 14%
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-px shrink-0 ${
            activeTab === 'account'
              ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>حسابي والأمان</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'users' && (
        <UsersTab
          users={users}
          isLoading={isUsersLoading}
          search={search}
          onSearchChange={setSearch}
          onCreateUser={createUser}
          onUpdateUser={updateUser}
          onToggleStatus={toggleUserStatus}
        />
      )}

      {activeTab === 'store' && (
        <StoreProfileTab
          store={store}
          isLoading={isStoreLoading}
          isSaving={isStoreSaving}
          onUpdateStore={updateStore}
        />
      )}

      {activeTab === 'account' && <AccountSecurityTab />}
    </div>
  );
};

export default Settings;
