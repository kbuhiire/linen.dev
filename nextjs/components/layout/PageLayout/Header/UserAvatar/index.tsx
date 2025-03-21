import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import { SerializedUser } from 'serializers/user';
import Avatar from 'components/Avatar';
import Modal from 'components/Modal';
import ProfileForm from './ProfileForm';

interface Props {
  currentUser: SerializedUser;
  onProfileChange({
    displayName,
    userId,
  }: {
    displayName: string;
    userId: string;
  }): Promise<void>;
}

enum Mode {
  Menu,
  Profile,
}

export default function UserAvatar({ currentUser, onProfileChange }: Props) {
  const userNavigation = [
    {
      name: 'Profile',
      onClick() {
        setMode(Mode.Profile);
      },
    },
    {
      name: 'Settings',
      onClick() {
        window.location.href = '/settings';
      },
    },
    {
      name: 'Sign out',
      onClick() {
        signOut();
      },
    },
  ];
  const [mode, setMode] = useState(Mode.Menu);
  return (
    <>
      <div className="flex h-16 justify-between">
        <div className="flex items-center">
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex items-center ">
                <span className="sr-only">Open user menu</span>
                <Avatar
                  size="md"
                  shadow="none"
                  src={currentUser.profileImageUrl}
                  text={currentUser.displayName}
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        onClick={item.onClick}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <Modal open={mode === Mode.Profile} close={() => setMode(Mode.Menu)}>
        <ProfileForm
          currentUser={currentUser}
          onSubmit={async ({ displayName, userId }) => {
            await onProfileChange({ displayName, userId });
            setMode(Mode.Menu);
          }}
        />
      </Modal>
    </>
  );
}
