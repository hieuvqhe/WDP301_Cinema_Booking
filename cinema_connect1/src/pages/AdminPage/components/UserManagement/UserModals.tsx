import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import type { AdminUser, UpdateUserRequest } from '../../../../types/Admin.type';

interface UserDetailModalProps {
  user: AdminUser;
  onClose: () => void;
}

export const UserDetailModal = ({ user, onClose }: UserDetailModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">User Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{user.phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Joined</p>
                <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-sm">Role</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'partner' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role.toUpperCase()}
              </span>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isVerified ? 'Active' : 'Banned'}
              </span>
            </div>
            
            {user.date_of_birth && (
              <div>
                <p className="text-gray-400 text-sm">Date of Birth</p>
                <p className="text-white">{new Date(user.date_of_birth).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
        
        {user.address && (
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-orange-400 mt-1" />
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <div className="text-white">
                  <p>{user.address.street}</p>
                  <p>{user.address.city}, {user.address.state}</p>
                  <p>{user.address.country} {user.address.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface EditUserModalProps {
  user: AdminUser;
  onClose: () => void;
  onSave: (userId: string, data: UpdateUserRequest) => void;
}

export const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
    address: user.address || {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-white">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Street</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, state: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, country: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteConfirmModalProps {
  user: AdminUser;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({ user, onClose, onConfirm }: DeleteConfirmModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Are you sure you want to delete this user?
        </p>
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <p className="text-red-400 text-sm mt-2">
          This action cannot be undone.
        </p>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete User
        </button>
      </div>
    </div>
  </div>
);
