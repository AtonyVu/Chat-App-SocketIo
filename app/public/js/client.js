const socket = io();
let id = "";
let avatarMale =
  "https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png";
let avatarFemale =
  "https://i.pinimg.com/474x/82/ab/35/82ab3533ee71daf256f23c1ccf20ad6f.jpg";
let sex = "";
const Acknewledgement = () => {
  console.log("đã gửi tin nhắn ");
};
const keypress = (e) => {
  console.log(e);
};
const submit = () => {
  let input = document.getElementById("message");
  let ul = document.getElementById("chat-box");
  if (input.value != "") {
    ul.innerHTML += `<li class="chat-left">
    <div class="chat-avatar">
      <img
        src="${sex == "male" ? avatarMale : avatarFemale}"
        alt="Retail Admin"
      />
      <div class="chat-name">Luan</div>
    </div>
    <div class="chat-text">
      ${input.value}
    </div>
    <div class="chat-hour">
      08:55 <span class="fa fa-check-circle"></span>
    </div>
    </li>`;
    socket.emit(
      "client-to-server",
      { chat: input.value, status: null },
      Acknewledgement
    );
    input.value = "";
    console.log("luan");
  }
};
///bat su kien
socket.on("server-to-client", (chat) => {
  console.log(chat.chat);
  let ul = document.getElementById("chat-box");
  ul.innerHTML += `
  <li class="chat-right">
  <div class="chat-hour">
    08:56 <span class="fa fa-check-circle"></span>
  </div>
  <div class="chat-text">
  ${chat.chat}
  </div>
  <div class="chat-avatar">
    <img
      src="${chat.sex == "male" ? avatarMale : avatarFemale}"
      alt="Retail Admin"
    />
    <div class="chat-name">${chat.user}</div>
  </div>
  </li>`;
});
socket.on("join-room", ({ id1, sex1 }) => {
  id = id1;
  sex = sex1;
});
socket.on("new-join-room", (userList) => {
  console.log(userList);
  if (userList.length != 0) {
    let ul = document.getElementById("users");
    ul.innerHTML = "";
    userList.forEach((item) => {
      if (item.id != id) {
        ul.innerHTML += `  <li class="person" data-chat="person1">
        <div class="user">
          <img
            src="${item.sex == "male" ? avatarMale : avatarFemale}"
            alt="Retail Admin"
          />
          <span class="status busy"></span>
        </div>
        <p class="name-time">
          <span class="name">${item.Name}</span>
          <span class="time">${item.date}</span>
        </p>
      </li>`;
      }
    });
  }
});
socket.emit(
  "join-info-room",
  Qs.parse(location.search, { ignoreQueryPrefix: true })
);
socket.on("dis-conect", (userList) => {
  let ul = document.getElementById("users");
  ul.innerHTML = "";
  userList.forEach((item) => {
    if (item.id != id) {
      ul.innerHTML += `  <li class="person" data-chat="person1">
      <div class="user">
        <img
          src="${item.sex == "male" ? avatarMale : avatarFemale}"
          alt="Retail Admin"
        />
        <span class="status busy"></span>
      </div>
      <p class="name-time">
        <span class="name">${item.Name}</span>
        <span class="time">${item.date}</span>
      </p>
    </li>`;
    }
  });
});
