import React, { useState, useRef } from 'react';
import styles from './Profile.module.scss';
import {
  FaLock, FaChevronDown, FaChevronUp,
  FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCircle, FaExclamationTriangle, FaSave, FaEye, FaEyeSlash
} from 'react-icons/fa';

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("123-456-789");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Available");
  const [isOnline, setIsOnline] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isPasswordAccordionOpen, setIsPasswordAccordionOpen] = useState(false);

  // Refs for focusing input fields
  const emailRef = useRef(null);
  const addressRef = useRef(null);

  const completionPercentage = () => {
    let completed = 0;
    if (firstName) completed += 30;
    if (email) completed += 30;
    if (phone) completed += 20;
    if (address) completed += 20;
    return completed;
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Yếu");
    } else if (password.length < 10) {
      setPasswordStrength("Trung bình");
    } else {
      setPasswordStrength("Mạnh");
    }
  };

  const handlePasswordChange = (password) => {
    setNewPassword(password);
    evaluatePasswordStrength(password);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const togglePasswordAccordion = () => {
    setIsPasswordAccordionOpen(!isPasswordAccordionOpen);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileSidebar}>
        <div className={styles.profileHeaderSidebar}>
          <div className={styles.avatarContainer}>
            <img
              src="https://via.placeholder.com/180"
              alt="Profile Avatar"
              className={styles.avatarImageSidebar}
            />
            <button className={styles.changeAvatarButton}>
              <FaCamera /> Thay đổi ảnh
            </button>
            <span className={`${styles.statusIndicator} ${isOnline ? styles.online : styles.offline}`}>
              <FaCircle /> {status}
            </span>
          </div>
          <div className={styles.profileSidebarName}>
            <h3 className={styles.userName}>{firstName || "Your Name"}</h3>
            <p className={styles.userTitle}>Team Manager</p>
            <div className={styles.userInfo}>
              {email ? (
                <p><FaEnvelope /> {email}</p>
              ) : (
                <p className={styles.warning} onClick={() => emailRef.current?.focus()}>
                  <FaExclamationTriangle /> Thêm email
                </p>
              )}
              {phone && <p><FaPhone /> {phone}</p>}
              {address ? (
                <p><FaMapMarkerAlt /> {address}</p>
              ) : (
                <p className={styles.warning} onClick={() => addressRef.current?.focus()}>
                  <FaExclamationTriangle /> Thêm địa chỉ
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileProgress}>
          <p>Hồ sơ của bạn hoàn thành {completionPercentage()}%</p>
          <div className={styles.progressBar}>
            <div className={`${styles.progress} ${completionPercentage() < 30 ? styles.lowProgress : completionPercentage() < 70 ? styles.mediumProgress : styles.highProgress}`} style={{ width: `${completionPercentage()}%` }}></div>
          </div>
        </div>

        <button className={styles.logOutButton} onClick={() => alert('Đăng xuất thành công')}>
          <FaLock className={styles.icon} /> Đăng xuất
        </button>
      </div>

      <div className={styles.profileMain}>
        <div className={styles.tabContent}>
          <h2>My Profile</h2>

          <div className={styles.profileSection}>
            <h3>Thông tin cá nhân</h3>
            <div className={styles.profileInfoGrid}>
              <div className={styles.profileRow}>
                <div className={styles.profileLabel}>Tên</div>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    className={styles.profileInput}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                  />
                </div>
              </div>

              <div className={styles.profileRow}>
                <div className={styles.profileLabel}>Email</div>
                <div className={styles.inputContainer}>
                  <input
                    ref={emailRef}
                    type="email"
                    className={styles.profileInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <div className={styles.profileRow}>
                <div className={styles.profileLabel}>Số Điện Thoại</div>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    className={styles.profileInput}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className={styles.profileRow}>
                <div className={styles.profileLabel}>Địa chỉ</div>
                <div className={styles.inputContainer}>
                  <input
                    ref={addressRef}
                    type="text"
                    className={styles.profileInput}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className={styles.profileSectionPassword}>
            <h3>Đổi Mật Khẩu</h3>
            <div className={styles.accordionHeader} onClick={togglePasswordAccordion}>
              <h3>Mật Khẩu</h3>
              {isPasswordAccordionOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {isPasswordAccordionOpen && (
              <div className={styles.accordionContent}>
                <div className={styles.profileRow}>
                  <div className={styles.profileLabel}><FaLock /> Mật Khẩu Mới</div>
                  <div className={styles.inputContainer}>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className={styles.profileInput}
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button className={styles.togglePasswordVisibilityButton} onClick={togglePasswordVisibility}>
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className={styles.passwordStrengthContainer}>
                  <p>Cấp độ bảo mật: <span className={styles[passwordStrength]}>{passwordStrength}</span></p>
                  <div className={styles.progressBarStrength}>
                    <div className={`${styles.progressStrength} ${styles[passwordStrength]}`} style={{ width: passwordStrength === "Yếu" ? '30%' : passwordStrength === "Trung bình" ? '60%' : '100%' }}></div>
                  </div>
                  <p className={styles.passwordHint}>Mật khẩu mạnh nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
                </div>

                <div className={styles.profileRow}>
                  <div className={styles.profileLabel}><FaLock /> Nhập lại mật khẩu</div>
                  <div className={styles.inputContainer}>
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      className={styles.profileInput}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button className={styles.togglePasswordVisibilityButton} onClick={toggleConfirmPasswordVisibility}>
                      {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button className={styles.saveProfileButton}><FaSave /> Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
