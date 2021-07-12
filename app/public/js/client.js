const socket = io();
let id = "";
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
        src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
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
      src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
      alt="Retail Admin"
    />
    <div class="chat-name">${chat.user}</div>
  </div>
  </li>`;
});
socket.on("join-room", (id1) => {
  id = id1;
  console.log(id);
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
            src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
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
          src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
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
