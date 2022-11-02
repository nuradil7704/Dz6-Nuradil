const tabs = document.querySelectorAll('.tabheader__item')
const tabsParent = document.querySelector('.tabheader__items')
const tabContent = document.querySelectorAll('.tabcontent')

const hideTabContent = () => {
    tabContent.forEach((item) => {
        item.style.display = "none";
    });
    tabs.forEach((item) => {
        item.classList.remove("tabheader__item_active");
    });
};
const showTabContent = (i = 1) => {
    tabContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active')
};

hideTabContent();
showTabContent();

tabsParent.addEventListener('click', (event)=>{
    const target = event.target
    tabs.forEach((item, i) => {
        if (target === item){
            hideTabContent();
            showTabContent(i);
        }
    });
    });

/////


let slideIndex = 0;

tabsParent.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("tabheader__item")) {
        tabs.forEach((item, i) => {
            if (target === item) {
                slideIndex = i;
                hideTabContent();
                showTabContent(slideIndex);
            }
        });
    }
});

const timer = () => {
    slideIndex++;
    if (slideIndex > 3) {
        slideIndex = 0;
    }
    hideTabContent()
    showTabContent(slideIndex)
}
setInterval(timer, 1000)

const modal = document.querySelector('.modal')
const modalTrigger = document.querySelector('[data-modal]')
const closeModalBtn = document.querySelector('.modal__close')

modalTrigger.addEventListener('click', openModal)

function openModal() {
  modal.classList.add('show')
  modal.classList.remove('hide')
  document.body.style.overflow = 'hidden'

}

function closeModal() {
  modal.classList.add('hide')
  modal.classList.remove('show')
  document.body.style.overflow = ''
}

closeModalBtn.addEventListener('click', closeModal)

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal()
  }
})

document.body.addEventListener('keydown', (event) => {
  if (event.code === 'Backspace') {
    closeModal()
  }
})

function openModalScroll() {
  const page = document.documentElement

  if (page.scrollTop + page.clientHeight >= page.scrollHeight) {
    openModal()

    window.removeEventListener('scroll', openModalScroll)
  }
}

window.addEventListener('scroll', openModalScroll);


const forms = document.querySelectorAll("form");

forms.forEach((item) => {
  bindPostData(item);
  console.log(item);
});

const message = {
  loading: "Идет загрузка",
  success: "Спасибо, скоро свяжемся c вами!",
  fail: "Что то пошло не так"
};

const postData = (url, data) => {
  const res = fetch(url, {
    method: "POST", 
    headers: {
      "Contetn-type": "application/json"
    },
    body: data,
  });
  return res;
}

function bindPostData (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const messageBlock = document.createElement("div");
    messageBlock.textContent = message.loading;
    messageBlock.style.cssText =  `
    display: block;
    margin: 20px auto 0;
    `;
    
    form.append(messageBlock);

    const request = new XMLHttpRequest();
    request.open("POST", "server.php");
    request.setRequestHeader("Content-Type", "application/json");

    
    const formData = new FormData(form);
    const object = {};
    formData.forEach((item, i) => {
      object[i] = item;
    });
    
    const json = JSON.stringify(object);
    request.send(json);

    request.addEventListener('load', ()=> {
      if (request.status === 300) {
        console.log(request.response);
        messageBlock.textContent = message.success;
      } else {
        messageBlock.textContent = message.fail;
      }
    })
    postData("server-php", JSON.stringify(object))
    .then((data) => {
      console.log(data);
      showThanksModal(message.success);
    })
    .catch(() => {
      showThanksModal(message.fail);
    })
    .finally(() => {
      form.reset();
      messageBlock.remove();
    });
	})
}
function showThanksModal(message) {
  openModal();
  const prevModal = document.querySelector(".modal__dialog");
  prevModal.classList.add("hide");

  const thanksModal = document.createElement("div");
  thanksModal.classList.add("modal__dialog");

  thanksModal.innerHTML = `
		<div class="modal__content">
			<div class="modal__close">x</div>
			<div class="modal__title">${message}</div>
		</div>
	`;
  modal.append(thanksModal);

  setTimeout(() => {
    prevModal.classList.remove("hide");
    closeModal();
    thanksModal.remove();
  }, 2000);
} 