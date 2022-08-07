export const adminMenu = [
  //quản lý người dùng
  {
    name: "menu.admin.home",
    menus: [{ name: "menu.admin.home", link: "/" }],
  },
  {
    name: "menu.admin.manage-user",
    menus: [
      { name: "menu.admin.crud", link: "/system/user-manage" },
      { name: "menu.admin.crud-redux", link: "/system/user-redux" },

      {
        name: "menu.admin.manage-doctor",
        link: "/system/manage-doctor",
        // subMenus: [
        //   {
        //     name: "menu.system.system-administrator.user-manage",
        //     link: "/system/user-manage",
        //   },
        //   {
        //     name: "menu.system.system-administrator.user-redux",
        //     link: "/system/user-redux",
        //   },
        // ],
      },
      // { name: "menu.admin.manage-admin", link: "/system/user-admin" },
    ],
  },
  //quản lý phòng khám
  {
    name: "menu.admin.clinic",
    menus: [
      { name: "menu.admin.manage-clinic", link: "/system/manage-clinic" },
    ],
  },
  //quản lý chuyên khoa
  {
    name: "menu.admin.specialty",
    menus: [
      { name: "menu.admin.manage-specialty", link: "/system/manage-specialty" },
    ],
  },

  //quản lý group role
  {
    name: "menu.admin.group-role",
    menus: [
      {
        name: "menu.admin.manage-group-role",
        link: "/system/manage-grouprole",
      },
    ],
  },

  //quản lý bác sĩ, lịch hẹn khám bệnh của đối tác
  {
    name: "menu.admin.partner",
    menus: [
      {
        name: "menu.admin.partner-clinic",
        link: "/system/partner-clinic/",
      },
      {
        name: "menu.admin.manage-appointment",
        link: "/system/manage-appointment",
      },
    ],
  },

  //quản lý kế hoạch khám bệnh của bác sĩ
  {
    name: "menu.admin.doctor",
    menus: [
      { name: "menu.admin.manage-schedule", link: "/system/manage-schedule" },
      { name: "menu.admin.manage-patient", link: "/system/manage-patient" },
    ],
  },

  // //quản lý  của hỗ trợ viên
  // {
  //   name: "menu.admin.supportor",
  //   menus: [
  //     {
  //       name: "menu.admin.manage-appointment",
  //       link: "/system/manage-appointment",
  //     },
  //   ],
  // },
];

// export const doctorMenu = [
//   //quản lý kế hoạch khám bệnh của bác sĩ
//   {
//     name: "menu.doctor.manage-schedule",
//     menus: [
//       { name: "menu.doctor.manage-schedule", link: "/doctor/manage-schedule" },
//       { name: "menu.doctor.manage-patient", link: "/doctor/manage-patient" },
//     ],
//   },
// ];
