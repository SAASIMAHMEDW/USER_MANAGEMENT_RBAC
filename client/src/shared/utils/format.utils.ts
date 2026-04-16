export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: 'Admin',
    manager: 'Manager',
    user: 'User',
  };
  return labels[role] || role;
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
  };
  return labels[status] || status;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-white/20 text-white',
    'bg-white/10 text-white',
    'bg-white/30 text-white',
    'bg-silver-mist/20 text-white',
    'bg-white/40 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
