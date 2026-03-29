import * as Switch from '@radix-ui/react-switch';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useProfile from '../../hooks/useProfile';
import { getItem, setItem } from '../../lib/storage';

import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
import emailOutline from '@iconify/icons-eva/email-outline';
import eyeOffOutline from '@iconify/icons-eva/eye-off-outline';
import eyeOutline from '@iconify/icons-eva/eye-outline';
import lockOutline from '@iconify/icons-eva/lock-outline';
import logOutFill from '@iconify/icons-eva/log-out-fill';
import personAddOutline from '@iconify/icons-eva/person-add-outline';
import personOutline from '@iconify/icons-eva/person-outline';
import shieldOutline from '@iconify/icons-eva/shield-outline';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import useLogout from '../../hooks/useLogout';

const Profile = () => {
  const {
    email,
    setEmail,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isCurrentPassword,
    setIsCurrentPassword,
    isNewPassword,
    setIsNewPassword,
    isNewPasswordConfirm,
    setIsNewPasswordConfirm,
    baseDataErrors,
    passwordChangeErrors,
    handlePasswordChangeSubmit,
    handleUpdateUser,
    handleDeleteUser,
  } = useProfile();
  const { handleLogoutConfirm } = useLogout();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    getItem('mode') === 'dark',
  );
  const [isBaseCredentialsOpen, setIsBaseCredentialsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark', 'c_darkmode');
      document.body.style.backgroundColor = '#1D2228';
      setItem('mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark', 'c_darkmode');
      document.body.style.backgroundColor = 'white';
      setItem('mode', 'light');
    }
  }, [isDarkMode]);

  return (
    <div
      id="profile-page"
      className="flex h-screen w-full flex-col overflow-y-auto bg-white px-5 !pb-16 dark:bg-[#1D2228] lg:pb-7"
    >
      <div className="mt-5 lg:mt-7">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Profile <span className="ml-1">✏️</span>
        </h1>
      </div>

      <div className="mt-4 flex w-full flex-col rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-card lg:mt-10 lg:w-1/2">
        <button
          type="button"
          onClick={() => setIsBaseCredentialsOpen((v) => !v)}
          className="flex w-full items-center justify-between p-3"
        >
          <div className="flex items-center gap-x-2">
            <Icon icon={personAddOutline} color="white" fontSize={35} />
            <h2 className="text-xl font-semibold text-white">
              Base credentials
            </h2>
          </div>
          <motion.div
            animate={{ rotate: isBaseCredentialsOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Icon icon={chevronDownFill} fontSize={30} color="white" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isBaseCredentialsOpen && (
            <motion.div
              key="base-credentials-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden px-3 pb-3"
            >
              <div className="relative flex flex-col gap-y-1">
                <label className="font-medium text-white">First name:</label>
                <input
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder={baseDataErrors.firstname ?? 'First name'}
                  autoComplete="new-firstname"
                  className={classNames(
                    'mt-1 rounded-full border-2 border-white bg-transparent py-1 pl-7 pr-4 text-white outline-none transition-all placeholder:text-gray-300 focus:border-cyan-200',
                    {
                      'border-red-400 placeholder:text-red-400':
                        baseDataErrors.firstname,
                    },
                  )}
                />
                <Icon
                  className="absolute top-6 left-3"
                  icon={personOutline}
                  color="white"
                  fontSize={25}
                />
              </div>

              <div className="relative mt-2 flex flex-col gap-y-1">
                <label className="font-medium text-white">Last name:</label>
                <input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder={baseDataErrors.lastname ?? 'Last name'}
                  autoComplete="new-lastname"
                  className={classNames(
                    'mt-1 rounded-full border-2 border-white bg-transparent py-1 pl-7 pr-4 text-white outline-none transition-all placeholder:text-gray-300 focus:border-cyan-200',
                    {
                      'border-red-400 placeholder:text-red-400':
                        baseDataErrors.lastname,
                    },
                  )}
                />
                <Icon
                  className="absolute top-6 left-3"
                  icon={personOutline}
                  color="white"
                  fontSize={25}
                />
              </div>

              <div className="relative mt-2 flex flex-col gap-y-1 pb-2">
                <label className="font-medium text-white">Email:</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={baseDataErrors.email ?? 'Email'}
                  autoComplete="new-email"
                  className={classNames(
                    'mt-1 rounded-full border-2 border-white bg-transparent py-1 pl-7 pr-4 text-white outline-none transition-all placeholder:text-gray-300 focus:border-cyan-200',
                    {
                      'border-red-400 placeholder:text-red-400':
                        baseDataErrors.email,
                    },
                  )}
                />
                <Icon
                  className="absolute top-6 left-3"
                  icon={emailOutline}
                  color="white"
                  fontSize={25}
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  className="rounded-full border-2 border-white px-4 py-1 uppercase text-white shadow-card transition-all hover:border-cyan-200"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex w-full flex-col rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 shadow-card lg:w-1/2">
        <button
          type="button"
          onClick={() => setIsPasswordChangeOpen((v) => !v)}
          className="flex w-full items-center justify-between p-3"
        >
          <div className="flex items-center gap-x-2">
            <Icon icon={shieldOutline} color="white" fontSize={35} />
            <h2 className="text-xl font-semibold text-white">
              Password change
            </h2>
          </div>
          <motion.div
            animate={{ rotate: isPasswordChangeOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Icon icon={chevronDownFill} fontSize={30} color="white" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isPasswordChangeOpen && (
            <motion.div
              key="password-change-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden px-3 pb-3"
            >
              <div className="relative flex flex-col gap-y-1 pb-2">
                <label className="font-medium text-white">
                  Current password:
                </label>
                <input
                  value={currentPassword}
                  type={isCurrentPassword ? 'password' : 'text'}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={
                    passwordChangeErrors.currentPassword ?? 'Current password'
                  }
                  autoComplete="new-password"
                  className={classNames(
                    'mt-1 rounded-full border-2 border-white bg-transparent py-1 pl-7 pr-4 text-white outline-none transition-all placeholder:text-gray-300 focus:border-cyan-200',
                    {
                      'border-red-400 placeholder:text-red-400':
                        passwordChangeErrors.currentPassword,
                    },
                  )}
                />
                <Icon
                  className="absolute top-6 left-3"
                  icon={lockOutline}
                  color="white"
                  fontSize={25}
                />
                <Icon
                  className="absolute top-6 right-3 cursor-pointer"
                  icon={isCurrentPassword ? eyeOutline : eyeOffOutline}
                  onClick={() => setIsCurrentPassword(!isCurrentPassword)}
                  color="white"
                  fontSize={25}
                />
              </div>

              <div className="relative mt-2 flex flex-col gap-y-1 pb-2">
                <label className="font-medium text-white">New password:</label>
                <input
                  value={newPassword}
                  type={isNewPassword ? 'password' : 'text'}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={
                    passwordChangeErrors.newPassword ?? 'New password'
                  }
                  autoComplete="new-password"
                  className={classNames(
                    'mt-1 rounded-full border-2 border-white bg-transparent py-1 pl-7 pr-4 text-white outline-none transition-all placeholder:text-gray-300 focus:border-cyan-200',
                    {
                      'border-red-400 placeholder:text-red-400':
                        passwordChangeErrors.newPassword,
                    },
                  )}
                />
                <Icon
                  className="absolute top-6 left-3"
                  icon={lockOutline}
                  color="white"
                  fontSize={25}
                />
                <Icon
                  className="absolute top-6 right-3 cursor-pointer"
                  icon={isNewPassword ? eyeOutline : eyeOffOutline}
                  onClick={() => setIsNewPassword(!isNewPassword)}
                  color="white"
                  fontSize={25}
                />
              </div>

              <div className="relative mt-2 flex flex-col gap-y-1 pb-2">
                <label className="font-medium text-white">
                  New password confirm:
                </label>
                <input
                  value={newPasswordConfirm}
                  type={isNewPasswordConfirm ? 'password' : 'text'}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder={
                    passwordChangeErrors.newPasswordConfirm ??
                    'New password confirm'
                  }
                  autoComplete="new-password"
                  className={classNames(
                    'mt-1 rounded-full border-2 border-white bg-transparent py-1 pl-7 pr-4 text-white outline-none transition-all placeholder:text-gray-300 focus:border-cyan-200',
                    {
                      'border-red-400 placeholder:text-red-400':
                        passwordChangeErrors.newPasswordConfirm,
                    },
                  )}
                />
                <Icon
                  className="absolute top-6 left-3"
                  icon={lockOutline}
                  color="white"
                  fontSize={25}
                />
                <Icon
                  className="absolute top-6 right-3 cursor-pointer"
                  icon={isNewPasswordConfirm ? eyeOutline : eyeOffOutline}
                  onClick={() => setIsNewPasswordConfirm(!isNewPasswordConfirm)}
                  color="white"
                  fontSize={25}
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordChangeSubmit}
                  className="rounded-full border-2 border-white px-4 py-1 uppercase text-white shadow-card transition-all hover:border-cyan-200"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex w-full flex-col rounded-2xl bg-gradient-to-r from-red-500 to-orange-700 shadow-card lg:w-1/2">
        <button
          type="button"
          onClick={() => setIsDangerZoneOpen((v) => !v)}
          className="flex w-full items-center justify-between p-3"
        >
          <div className="flex items-center gap-x-2">
            <Icon icon={alertTriangleOutline} color="white" fontSize={35} />
            <h2 className="text-xl font-semibold text-white">Danger zone</h2>
          </div>
          <motion.div
            animate={{ rotate: isDangerZoneOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Icon icon={chevronDownFill} fontSize={30} color="white" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isDangerZoneOpen && (
            <motion.div
              key="danger-zone-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden px-3 pb-3"
            >
              <button
                onClick={handleDeleteUser}
                className="mb-1 rounded-xl border-2 border-white bg-transparent px-3 py-1 font-semibold uppercase text-white shadow-card transition-all hover:bg-red-700"
              >
                delete profile
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-slate-600 to-slate-500 p-3 shadow-card lg:w-1/2">
        <label
          className="text-xl font-semibold text-white"
          htmlFor="dark-mode-switch"
        >
          Dark mode
        </label>
        <Switch.Root
          id="dark-mode-switch"
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
          className={`
            relative h-3.5 w-7 cursor-pointer rounded-full border-2 
            border-transparent bg-slate-400 outline-none
            transition-colors data-[state=checked]:bg-[#1490d3]`}
        >
          <Switch.Thumb
            className={`
              block h-3 w-3 translate-x-0 rounded-full bg-white 
              shadow-md transition-transform duration-200 
              data-[state=checked]:translate-x-3.5`}
          />
        </Switch.Root>
      </div>

      <button
        type="button"
        className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#1490d3] px-3 py-2 text-center text-xl font-semibold uppercase text-white"
        onClick={handleLogoutConfirm}
      >
        <span>Log out</span>
        <Icon icon={logOutFill} fontSize={30} />
      </button>
    </div>
  );
};

export default Profile;
