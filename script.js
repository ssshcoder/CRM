(async function() {

   // ПЕРЕМЕННЫЕ

   const addClientBtn = document.querySelector('.add-client-btn')
   const searchInput = document.querySelector('.header__search')

   const sortingBtns = document.querySelectorAll('.sorting-btn')
   const IDBtn = document.querySelector('.ID-sorting-btn')
   const FIOBtn = document.querySelector('.FIO-sorting-btn')
   const createdAtBtn = document.querySelector('.creation-data-sorting-btn')
   const updatedAtBtn = document.querySelector('.last-changes-sorting-btn')

   let contactsNum // вспомогательная переменная для счета контактов в открытом попапе


   let clientsArray = await getClients()
   let tableElements
   tableElements = refreshTable(clientsArray)


   // СЛУЖЕБНОЕ (удалить в конце)

   //    // пример нового клиента
   // const clData = {
   //    name: 'Света',
   //    surname: 'Логинова',
   //    lastName: 'Алексеевна',
   //    contacts: [
   //      {
   //        type: 'Телефон',
   //        value: '+71234567899'
   //      },
   //      {
   //        type: 'Email',
   //        value: 'abc@xцyz.com'
   //      },
   //      {
   //       type: 'vk',
   //       value: '1abc@xцyz.com'
   //     },
   //     {
   //       type: 'vk',
   //       value: '2abc@xцyz.com'
   //     },
       
        
        
   //    ]
   // }
   //    // тоже но для теста обновления данных о клиенте
   // const newClData = {
   //    name: 'Артем',
   //    surname: 'Гурков',
   //    lastName: 'Васильевич',
   //    contacts: [
   //      {
   //        type: 'Телефон',
   //        value: '+71234567899'
   //      },
   //      {
   //        type: 'Email',
   //        value: 'abc@xцyz.com'
   //      },
   //      {
   //        type: 'Facebook',
   //        value: 'https://facebook.com/vasiliy-pupkin-the-best'
   //      }
   //    ]
   // }

   // function clg(message) {
   //    console.log(message)
   // }

   // console.log(tableElements)
   // console.log(clientsArray)  
   // addClient(clData)
   

   // ФУНКЦИИ

   // функции связаные с взаимодействием с сервером
   async function getClients() {
      let res = await fetch('http://localhost:3000/api/clients')

      return res.json()
   }

   async function addClient(clientData) {
      let res = await fetch('http://localhost:3000/api/clients', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(clientData)
      })
      
      return res.json()
   }

   async function getClientDataById(id) {
      let res = await fetch('http://localhost:3000/api/clients/' + id)

      return res.json()
   }

   async function changeClientDataById(id, newClientData) {
      let res = await fetch('http://localhost:3000/api/clients/' + id, {
         method:'PATCH',
         body: JSON.stringify(newClientData)
      })
      console.log(`вы изменили данные клиента ${id}`)
      return res.json()
   }

   async function deleteClientDataById(id) {
      let res = await fetch('http://localhost:3000/api/clients/' + id, {
         method:'DELETE'
      })

      return res.json()
   }

   function createContactIcon(contactData, contactsContainer) {

   // создаю элементы, даю классы для иконок с контактами
   const contactContainer = document.createElement('a')
   contactContainer.classList.add('table-body__contact')
   const tooltip = document.createElement('div')
   tooltip.classList.add('tooltip')
   const tooltipSpan = document.createElement('span')
   tooltipSpan.classList.add('tooltipSpan')

   // условия
   if (contactData.type == 'Телефон' || contactData.type == 'Доп.телефон') {
      contactContainer.classList.add('contact-tel')
   } else if (contactData.type == 'Email') {
      contactContainer.classList.add('contact-email')
   } else if (contactData.type == 'Facebook') {
      contactContainer.classList.add('contact-fb')
      contactContainer.href = contactData.value
      contactContainer.target = '_blank'
   } else if (contactData.type == 'vk') {
      contactContainer.classList.add('contact-vk')
      contactContainer.href = contactData.value
      contactContainer.target = '_blank'
   }
   tooltip.textContent = `${contactData.type}:`
   tooltipSpan.textContent = contactData.value

   // помещаю
   contactContainer.append(tooltip)
   tooltip.append(tooltipSpan)
   contactsContainer.append(contactContainer)

   return contactContainer

   }


   // функции связаные с сортировкой и поиском
   async function searchClients(inputValue) {

      // получаю список клиентов
      const clients = await getClients()
      console.log(clients)
      // фильтрую список
      const filtredArr = filterClients(clients)
      // обновляю таблицу
      tableElements = refreshTable(filtredArr)

      // // функция фильтрации по ФИО и ID
      function filterClients(arr) {

      const result = arr.filter(function(client) {
         const FIO = `${client.name.toLowerCase()} ${client.surname.toLowerCase()} ${client.lastName.toLowerCase()}`
         const id = client.id
         if (FIO.includes(searchInput.value.toLowerCase()) || id.includes(searchInput.value.toLowerCase())) return true

      })
      return result

      }

   }
   
   let SortedUP = false // вспомогательная переменная для корректной смены направления сортировки
   function sortClients(arr, prop) {

      // false - по возрастанию, true - по убыванию
      let direction = false

      // логика со сменой направления
      if (!SortedUP) {
         direction = false
         SortedUP = true
      } else {
         direction = true
         SortedUP = false
      }

      let copyArr = [...arr]
      let result = copyArr.sort(function(a,b) {

         
         if (prop == 'ID') {
            console.log('Сортирую по ID...')
            for (const btn of sortingBtns) {
               btn.classList.remove('is-active')
            }
            IDBtn.classList.add('is-active')

            let dirCondition = a["id"] < b["id"]
            if (direction) dirCondition = a["id"] > b["id"]
            if (dirCondition) return -1
         } else

         if (prop == 'FIO') {
            console.log('Сортирую по FIO...')
            for (const btn of sortingBtns) {
               btn.classList.remove('is-active')
            }
            FIOBtn.classList.add('is-active')
            
            let fullNameA = `${a['name']} ${a['surname']} ${a['lastName']}`
            let fullNameB = `${b['name']} ${b['surname']} ${b['lastName']}`
            let dirCondition = fullNameA < fullNameB
            if (direction) dirCondition = fullNameA > fullNameB
            
            if (dirCondition) return -1
         } else

         if (prop == 'updatedAt') {
            console.log('Сортирую по updatedAt...')
            for (const btn of sortingBtns) {
               btn.classList.remove('is-active')
            }
            updatedAtBtn.classList.add('is-active')

            let dirCondition = new Date(a["updatedAt"]).getTime() < new Date(b["updatedAt"]).getTime()
            if (direction) dirCondition = new Date(a["updatedAt"]).getTime() > new Date(b["updatedAt"]).getTime()
            if (dirCondition) return -1
         } else

         if (prop == 'createdAt') {
            console.log('Сортирую по createdAt...')
            for (const btn of sortingBtns) {
               btn.classList.remove('is-active')
            }
            createdAtBtn.classList.add('is-active')

            let dirCondition = new Date(a["createdAt"]).getTime() < new Date(b["createdAt"]).getTime()
            console.log(new Date(a["createdAt"]).getTime())
            if (direction) dirCondition = new Date(a["createdAt"]).getTime() > new Date(b["createdAt"]).getTime()
            if (dirCondition) return -1
         }
            
         })
         console.log(result)
         tableElements = refreshTable(result)
         // refreshTable(tableElements)
         return result
   }


   // функции связаные с взимодействием с DOM-деревом
   function refreshTable(arr) {
      const tableBody = document.querySelector('.table-body')
      const clientsElements = []

      // очищаю таблицу от ранее созданных элементов (если есть)
      if(tableElements) {
         console.log('Удаляю ранее созданные элементы, создаю новые...')
         for (const el of tableElements) {
            el.remove()
         }
      }

      // Создаю элемент(строку) для каждого обьекта(клиента)
      for (const client of arr) {
         // создаю элеметы таблицы (строки и столбцы)
         const tr = document.createElement('tr')
         const IdTd = document.createElement('td')
         const FIOTd = document.createElement('td')
         const createDateTd = document.createElement('td')
         const createDateSpan = document.createElement('span')
         const lastUpdateTd = document.createElement('td')
         const lastUpdateSpan = document.createElement('span')
         const contactsTd = document.createElement('td')
         const actionsTd = document.createElement('td')
         const actionsContainer = document.createElement('div')
         const changeBtn = document.createElement('button')
         const deleteBtn = document.createElement('button')

         // присваиваю элементам классы
         tr.classList.add('table-body__row', 'client')
         IdTd.classList.add('table-body__item', 'table-body-id')
         FIOTd.classList.add('table-body__item')
         createDateTd.classList.add('table-body__item')
         lastUpdateTd.classList.add('table-body__item')
         contactsTd.classList.add('table-body__item')
         contactsTd.classList.add('table-body__item')
         actionsTd.classList.add('table-body__item')
         actionsContainer.classList.add('table-body__actions')
         changeBtn.classList.add('table-body__btn', 'change-btn')
         deleteBtn.classList.add('table-body__btn', 'delete-btn')

         // присваиваю значения ячейкам:
         IdTd.textContent = client.id
         FIOTd.textContent = `${client.surname} ${client.name} ${client.lastName}`
            //    Дата и время создания
         const createdAt = new Date(client.updatedAt)
         const creationDay = (createdAt.getDate()) <= 9 ? `0${createdAt.getDate()}` : `${createdAt.getDate()}`
         const creationMonth = (createdAt.getMonth() + 1) <= 9 ? `0${createdAt.getMonth() + 1}` : `${createdAt.getMonth() + 1}`
         const creationHours = (createdAt.getHours()) <= 9 ? `0${createdAt.getHours()}` : `${createdAt.getHours()}`
         const creationMinute = (createdAt.getMinutes()) <= 9 ? `0${createdAt.getMinutes()}` : `${createdAt.getMinutes()}`
         createDateTd.textContent = `${creationDay}.${creationMonth}.${createdAt.getFullYear()} `
         createDateTd.append(createDateSpan)
         createDateSpan.textContent = `${creationHours}:${creationMinute}`
            //    Последние изменения
         const updatedAt = new Date(client.updatedAt)
         const updationDay = (updatedAt.getDate()) <= 9 ? `0${updatedAt.getDate()}` : `${updatedAt.getDate()}`
         const updationMonth = (updatedAt.getMonth() + 1) <= 9 ? `0${updatedAt.getMonth() + 1}` : `${updatedAt.getMonth() + 1}`
         const updationHours = (updatedAt.getHours()) <= 9 ? `0${updatedAt.getHours()}` : `${updatedAt.getHours()}`
         const updationMinute = (updatedAt.getMinutes()) <= 9 ? `0${updatedAt.getMinutes()}` : `${updatedAt.getMinutes()}`
         lastUpdateTd.textContent = `${updationDay}.${updationMonth}.${updatedAt.getFullYear()} `
         lastUpdateTd.append(lastUpdateSpan)
         lastUpdateSpan.textContent = `${updationHours}:${updationMinute}`
            //    Контакты
         const contactsContainer = document.createElement('div')
         contactsContainer.classList.add('table-body__contacts')

         const contactIcons = []          // создаю массив иконок контактов
         for (const contactData of client.contacts) {
            const contactIcon = createContactIcon(contactData, contactsContainer)
            contactIcons.push(contactIcon) // помещаю в массив все иконки
         }

         if (contactIcons.length > 5) {
            // создаю иконку +n, если контактов больше 4-х
            const plusNIcon = document.createElement('button')
            const n = contactIcons.length - 4
            plusNIcon.textContent = `+${n}`
            plusNIcon.classList.add('plus-n-icon')

            // скрываю все "лишние" контакты, оставляю 4 первых
            const hiddenContacts = []
            for (const i in contactIcons) {
               if (i > 3) {
                  contactIcons[i].style.display = 'none'
                  hiddenContacts.push(contactIcons[i])
               }
            }

            // добавляю иконку +n в конец контактов
            contactsContainer.append(plusNIcon)

            // добавляю обработчик события на нажатие, с дальнейшим раскрытием не поместившихся контактов
            plusNIcon.addEventListener('click', () => {
               plusNIcon.style.display = 'none'

               for (const hiddenContact of hiddenContacts) {
                  hiddenContact.style.display = 'inline-block'
               }

               for (const i in contactIcons) {
                  if (i <= 4) {
                     contactIcons[i].style.marginBottom = '7px'
                  }
               }

            })

         } 

         contactsTd.append(contactsContainer)

         // доб. разметку с иконками svg в кнопки 'Изменить' и 'Удалить'
         changeBtn.innerHTML = `
            <svg class="change-btn__svg" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill="#9873FF"/>
            </svg>
            <svg class="spinner change-btn__svg" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
            Изменить`

         deleteBtn.innerHTML = `
         <svg class="change-btn__svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#F06A4D"/>
         </svg>
         <svg class="change-btn__svg spinner" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
         </svg>
         Удалить`

         
         // помещаю элементы друг в друга
         actionsTd.append(actionsContainer)
         actionsContainer.append(changeBtn)
         actionsContainer.append(deleteBtn)
         lastUpdateTd.append(lastUpdateSpan)
         tr.append(IdTd)
         tr.append(FIOTd)
         tr.append(createDateTd)
         tr.append(lastUpdateTd)
         tr.append(contactsTd)
         tr.append(actionsTd)

         // помещаю строку в таблицу
         tableBody.append(tr)
         // помещаю строку в массив строк
         clientsElements.push(tr)
  
      }

      // ОБРАБОТЧИКИ СОБЫТИЙ

      // открытие попапа (изменить данные клиента) | навешивается на все кнопки 'Изменить'
      let changeClientsDataButtons = document.querySelectorAll('.change-btn')
      for (const changeBtn of changeClientsDataButtons) {
         changeBtn.addEventListener('click', (e) => {
            openChangeDataPopup(e.target)
         })
      }

      // открытие попапа (удалить клиента) | навешивается на все кнопки 'Х Удалить' 
      let deleteClientButtons = document.querySelectorAll('.delete-btn')
      for (const deleteBtn of deleteClientButtons) {
         deleteBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const id = e.target.parentElement.parentElement.parentElement.children[0].textContent
            openDeleteClientPopup(id)
         })
      }

      return clientsElements
   }
   
   async function deleteClient(id) {
      for (const tableElement of tableElements) {

         if (tableElement.children[0].textContent == id ) {
            await deleteClientDataById(id)
            tableElement.remove()
            closeAllPopups()
         }

      }
   }

   function makeContactLayout(inputValue, selectValue, addContactBtn) {
      const contact = document.createElement('div')
      const select = document.createElement('select')
      const option_1 = document.createElement('option')
      const option_2 = document.createElement('option')
      const option_3 = document.createElement('option')
      const option_4 = document.createElement('option')
      const option_5 = document.createElement('option')
      const input = document.createElement('input')
      const button = document.createElement('button')


      contact.classList.add('contacts-section__contact', 'contact')
      select.classList.add('contact__select', 'select', 'js-choice')
      option_1.classList.add('select__option')
      option_2.classList.add('select__option')
      option_3.classList.add('select__option')
      option_4.classList.add('select__option')
      option_5.classList.add('select__option')
      input.classList.add('contact__input')
      button.classList.add('contact__clear-btn')

      option_1.value = 'Телефон'
      option_2.value = 'Доп.телефон'
      option_3.value = 'Email'
      option_4.value = 'vk'
      option_5.value = 'Facebook'


      option_1.textContent = 'Телефон'
      option_2.textContent = 'Доп. телефон'
      option_3.textContent = 'Email'
      option_4.textContent = 'Vk'
      option_5.textContent = 'Facebook'   


      input.placeholder = 'Введите данные контакта'
      input.value = inputValue ? inputValue : ''

      // устанавливает тип контакта
      selectValue == 'Телефон' ? option_1.selected = true : option_1.value.selected = true
      selectValue == 'Доп.телефон' ? option_2.selected = true : option_1.value.selected = true
      selectValue == 'Email' ? option_3.selected = true : option_1.value.selected = true
      selectValue == 'vk' ? option_4.selected = true : option_1.value.selected = true
      selectValue == 'Facebook' ? option_5.selected = true : option_1.value.selected = true

      select.append(option_1)
      select.append(option_2)
      select.append(option_3)
      select.append(option_4)
      select.append(option_5)
      contact.append(select)
      contact.append(input)
      contact.append(button)

      // choices
      const choices = new Choices(select, {
         searchEnabled: false,
         placeholder: false,
         itemSelectText:'',
      });

      function del(e) {
         e.preventDefault()
         deleteContact(contact)
         console.log(`Удален контакт: `)
         console.log(contact)
         contactsNum--
         if (contactsNum <= 9) addContactBtn.style.display = 'block'
         console.log(contactsNum)
      }

      button.addEventListener('click', del)

      return contact
   }

   function addContact(popup, inputValue, selectValue) {

      const contactsContainer = popup.querySelector('.contacts-section__contacts-container')
      const addContactBtn = popup.querySelector('.contacts-section__add-btn')
      const contact = makeContactLayout(inputValue, selectValue, addContactBtn)
      contactsContainer.append(contact)

      return contact
   }

   function deleteContact(contact) {
      contact.remove()
   }

   function openAddClientPopup() {
      const popup = document.querySelector('.new-client-popup')
      closeBtn = popup.querySelector('.popup__close'),
      popupBody = popup.querySelector('.popup__body'),
      cancelBtn = popup.querySelector('.popup-buttons__cancel-btn'),
      addContactBtn = popup.querySelector('.contacts-section__add-btn'),
      contactsContainer = popup.querySelector('.contacts-section__contacts-container'),
      saveClientBtn = popup.querySelector('.popup-buttons__save-btn'),
      errorMessage = popup.querySelector('.popup-buttons__error')
      // поля формы
      const inputs = popup.querySelectorAll('.change-data-form__input')
      const inputName = inputs[1]
      const inputSurname = inputs[0]
      const inputLast = inputs[2]

      popup.classList.add('open')
      document.body.style.overflow = 'hidden'
             
      // очищаю список контактов
      contactsContainer.innerHTML = ''

      // очищаю поля ввода
      for (const input of inputs) {
         input.value = ''
      }

      // очищаю сообщение об ошибке
      errorMessage.style.display = 'none'
      errorMessage.textContent = ''
            
      const contactsSection = popup.querySelector('.contacts-section')
      contactsNum = 0

      // добавление контакта
      let f = function(e) {
         // проверка на количество контактов
         if (contactsNum >= 9) {
            e.preventDefault()
            addContact(popup)
            contactsNum++
            console.log(contactsNum)
            addContactBtn.style.display = 'none'
         } else {
            e.preventDefault()
            addContact(popup)
            contactsNum++
            console.log(contactsNum)
         }
         // проверка на паддинги
         if (contactsNum >= 1) {
            contactsSection.classList.add('with-paddings')
         } 

      }
      addContactBtn.addEventListener('click', f) 

      // Добавление нового клиента
      async function saveNewClient(e) {
         e.preventDefault()
         
         // Валидация
         console.log(inputName.value)
         if (inputName.value == '') {
            errorMessage.style.display = 'block'
            errorMessage.textContent = 'Введите имя клиента!'
         } else
         if (inputSurname.value == '') {
            errorMessage.style.display = 'block'
            errorMessage.textContent = 'Введите фамилию клиента!'
         } else {

            //(1) часть, связанная со сбором и отправкой обновленных данных на сервер
            const contacts = []
            // собираю данные из полей контакты в массив contacts
            for (const contactContainer of contactsContainer.children) {
               
               const selectData = contactContainer.children[0].querySelector('.select').value
               const inputData = contactContainer.children[1].value

               const contact = {
                  type: selectData,
                  value: inputData
               }

               contacts.push(contact)

            }

            // обьект с данными о новом клиенте
            const newClientData = {
               name: inputName.value,
               surname: inputSurname.value,
               lastName: inputLast.value,
               contacts: contacts
            }
            // отправка данных на сервер
            await addClient(newClientData)

            saveClientBtn.removeEventListener('click', saveNewClient)


            //(2) часть, связанная с обновлением списка клиентов и обновлением DOM елементов на странице

            // очистка контактов
            for (const contact of contactsContainer.children) {
               contact.remove()
            }

            clientsArray = await getClients()
            console.log(`1. сечение`)
               // удаляю "устаревшие" tableElements 
            for (const item of tableElements) {
               item.remove()
            }

            closePopup()
            console.log(`2. сечение`)
            tableElements = refreshTable(clientsArray)

            console.log(`3. сечение`)
            console.log(clientsArray)

      }

         // // НАВЕСИТЬ ОБРАБОТЧИКИ СОБЫТИЙ НА "НОВЫЕ" КНОПКИ!!!!!!

         // // открытие попапа (изменить данные клиента) | навешивается на все кнопки 'Изменить'
         // let changeClientsDataButtons = document.querySelectorAll('.change-btn')
         // for (const changeBtn of changeClientsDataButtons) {
         //    changeBtn.addEventListener('click', (e) => {
         //       openChangeDataPopup(e.target)
         //    })
         // }

         // // открытие попапа (удалить клиента) | навешивается на все кнопки 'Х Удалить' 
         // let deleteClientButtons = document.querySelectorAll('.delete-btn')
         // for (const deleteBtn of deleteClientButtons) {
         //    deleteBtn.addEventListener('click', (e) => {
         //       const id = e.target.parentElement.parentElement.parentElement.children[0].textContent
         //       openDeleteClientPopup(id)
         //    })
         // }

      }

      saveClientBtn.addEventListener('click', saveNewClient)

      // функция закрытия попапа
      function closePopup() {

         popup.classList.remove('open')
         document.body.style.overflow = 'auto'

         addContactBtn.removeEventListener('click', f)
         saveClientBtn.removeEventListener('click', saveNewClient)
         document.removeEventListener('keydown', esc)

         contactsContainer.innerHTML = ''
         
         contactsSection.classList.remove('with-paddings')
      }

      // закрытие по нажатию затемненной области
      popup.addEventListener('click', (e) => {
         if (e.target === popupBody) {
            closePopup(e)
         }
      })

      // закрытие по крестику
      closeBtn.addEventListener('click', closePopup)

      // закрытие по кнопке отмена
      cancelBtn.addEventListener('click', (e) => {
         closePopup(e)
      })

      // закрытие по нажатию Esc
      function esc(e) {
         console.log(e.code)
         if (e.code == 'Escape') {
            closePopup()
         } 
      }
      document.addEventListener('keydown', esc)

   }

   function openDeleteClientPopup(id) {
      const popup = document.querySelector('.delete-client-popup')
      closeBtn = popup.querySelector('.popup__close'),
      popupBody = popup.querySelector('.popup__body'),
      cancelBtn = popup.querySelector('.popup-buttons__cancel-btn'),
      deleteBtn = popup.querySelector('.popup-buttons__delete-btn')

      popup.classList.add('open')
      document.body.style.overflow = 'hidden'
      
      // закрытие попапа
         // функция
      function closePopup(e) {
         if (e) {
            console.log(e)
            if (e.target == closeBtn || e.target == cancelBtn) {
               e.preventDefault()
            }
         }

         popup.classList.remove('open')
         document.body.style.overflow = 'auto'
         closeBtn.removeEventListener('click', closePopup)
         cancelBtn.removeEventListener('click', closePopup)
         deleteBtn.removeEventListener('click', del)
         document.removeEventListener('keydown', esc)
         
      }
         // слушатели
      popup.addEventListener('click', (e) => {
         if (e.target === popupBody) {
            closePopup()
         }
      })
      closeBtn.addEventListener('click', closePopup)
      cancelBtn.addEventListener('click', closePopup)

      // закрытие по нажатию Esc
      function esc(e) {
         console.log(e.code)
         if (e.code == 'Escape') {
            closePopup()
         } 
      }
      document.addEventListener('keydown', esc)

      // удаление клиента
         // функция 
      let del = function(e) {
         e.preventDefault()
         console.log(`Удален элемент с id: ${id}`)
         deleteClient(id)
         popup.classList.remove('open')
         document.body.style.overflow = 'auto'
         deleteBtn.removeEventListener('click', del)
      }
      deleteBtn.focus()
         // слушатель на кнопку
      deleteBtn.addEventListener('click', del) 

   }

   function openChangeDataPopup(trigger) {
      const popup = document.querySelector('.change-data-popup'),
      closeBtn = popup.querySelector('.popup__close'),
      popupBody = popup.querySelector('.popup__body'),
      idContainer = popup.querySelector('.popup__id'),
      removeClientBtn = popup.querySelector('.popup-buttons__cancel-btn'),
      addContactBtn = popup.querySelector('.contacts-section__add-btn'),
      contactsContainer = popup.querySelector('.contacts-section__contacts-container'),
      saveChangesBtn = popup.querySelector('.popup-buttons__save-btn')
      // поля формы
      const inputs = popup.querySelectorAll('.change-data-form__input')
      const inputName = inputs[1]
      const inputSurname = inputs[0]
      const inputLast = inputs[2]
      // количество контактов в попапе
      contactsNum = 0

      // очистка контактов
      // for (const contact of contactsContainer.children) {
      //    contact.remove()
      //    console.log(`Удаляю контакт со значением: ${contact.children[1].value}`)
      //    // console.log(contact.children[1].value)
      // }
      contactsContainer.innerHTML = ''


      // добавляю данные о контакте в соответствующие поля:
      const id = trigger.parentElement.parentElement.parentElement.firstElementChild.textContent // получаю id клиента из таблицы
      const clientData = clientsArray.find((item) => {   // получаю обьект с данными конкретного клиента по id
         return item.id == id
      })
      //    id
      idContainer.textContent = `ID:${id}`
      //    Имя
      inputName.value = clientData.name
      //   Фамилия
      inputSurname.value = clientData.surname
      //   Отчество
      inputLast.value = clientData.lastName
      //    Контакты
      for (const contact of clientData.contacts) {
         addContact(popup, contact.value, contact.type)
         console.log(`Добавляю контакт со значением: ${contact.value}`)
         contactsNum++
      }

      // логика добавления padding на секцию контакты
      const contactsSection = popup.querySelector('.contacts-section')

      if (contactsContainer.children.length > 0) {
         contactsSection.classList.add('with-paddings')
      } 
      else {
         contactsSection.classList.remove('with-paddings')
      }

      
      // открытие попапа и заморозка склола
      popup.classList.add('open')
      document.body.style.overflow = 'hidden' 


      // добавление нового контакта 
      let addCntc = function(e) {

         // проверка на количество контактов
         if (contactsNum >= 9) {
            e.preventDefault()
            addContact(popup)
            contactsNum++
            console.log(contactsNum)
            addContactBtn.style.display = 'none'
         } else {
            e.preventDefault()
            addContact(popup)
            contactsNum++
            console.log(contactsNum)
         }
         // проверка на паддинги
         if (contactsNum >= 1) {
            contactsSection.classList.add('with-paddings')
         } 

      }
      addContactBtn.addEventListener('click', addCntc)

      // закрытие данного попапа
      function closePopup() {
         popup.classList.remove('open')
         document.body.style.overflow = 'auto'

         addContactBtn.removeEventListener('click', addCntc)
         removeClientBtn.removeEventListener('click', del)
         saveChangesBtn.removeEventListener('click', saveChanges)
         document.removeEventListener('keydown', esc)

         contactsContainer.innerHTML = ''
      }

      // закрытие по нажатию Esc
      function esc(e) {
         console.log(e.code)
         if (e.code == 'Escape') {
            closePopup()
         } 
      }
      document.addEventListener('keydown', esc)

      // закрытие по затемненой области
      popup.addEventListener('click', (e) => {
         if (e.target === popupBody) {
            closePopup()
         }
      })

      // закрытие по крестику
      closeBtn.addEventListener('click', closePopup)

      // сохранение изменений
      async function saveChanges(e) {
         e.preventDefault()

         //(1) часть, связанная со сбором и отправкой обновленных данных на сервер
         const contacts = []
         // собираю данные из полей контакты в массив contacts
         for (const contactContainer of contactsContainer.children) {
            
            const selectData = contactContainer.children[0].querySelector('.select').value
            const inputData = contactContainer.children[1].value

            const contact = {
               type: selectData,
               value: inputData
            }

            contacts.push(contact)

         }
         // обьект с новыми данными
         const newClientData = {
            name: inputName.value,
            surname: inputSurname.value,
            lastName: inputLast.value,
            contacts: contacts
         }
         console.log(newClientData)
         // отправка обновленных данных на сервер
         let l = await changeClientDataById(id, newClientData)
         console.log(l)
         saveChangesBtn.removeEventListener('click', saveChanges)


         //(2) часть, связанная с обновлением списка клиентов и обновлением DOM елементов на странице

         // очистка контактов
         for (const contact of contactsContainer.children) {
            contact.remove()
         }

         clientsArray = await getClients()
            // удаляю "устаревшие" tableElements 
         for (const item of tableElements) {
            item.remove()
         }

         closePopup()
         tableElements = refreshTable(clientsArray)

         console.log(clientsArray)

         // // НАВЕСИТЬ ОБРАБОТЧИКИ СОБЫТИЙ НА "НОВЫЕ" КНОПКИ!!!!!!

         // // открытие попапа (изменить данные клиента) | навешивается на все кнопки 'Изменить'
         // let changeClientsDataButtons = document.querySelectorAll('.change-btn')
         // for (const changeBtn of changeClientsDataButtons) {
         //    changeBtn.addEventListener('click', (e) => {
         //       openChangeDataPopup(e.target)
         //    })
         // }

         // // открытие попапа (удалить клиента) | навешивается на все кнопки 'Х Удалить' 
         // let deleteClientButtons = document.querySelectorAll('.delete-btn')
         // for (const deleteBtn of deleteClientButtons) {
         //    deleteBtn.addEventListener('click', (e) => {
         //       const id = e.target.parentElement.parentElement.parentElement.children[0].textContent
         //       openDeleteClientPopup(id)
         //    })
         // }

      }

      saveChangesBtn.addEventListener('click', saveChanges)


      // удаление клиента
      function del(e) {
         e.preventDefault()
         console.log('ID из попапа:' + id)
         openDeleteClientPopup(id)
         removeClientBtn.removeEventListener('click', del)
      }
      // кнопка удалить клиента
      removeClientBtn.addEventListener('click', del)

   }

   function closeAllPopups() {
      const openPopups = document.querySelectorAll('.open')
      for (const popup of openPopups) {
         popup.classList.remove('open')
      }
   }

   // Сортировка по умолчанию по ID по возрастанию
   sortClients(clientsArray, 'ID')
   if (SortedUP) IDBtn.classList.toggle('arrow-up')


//        ОБРАБОТЧИКИ СОБЫТИЙ

   // открытие попапа (добавить клиента)| навешивается на кнопку 'Добавить клиента'
   addClientBtn.addEventListener('click', openAddClientPopup)


   // сортировка по ID | навешивается на кнопку "ID"
   IDBtn.addEventListener('click', () => {
      for (const bt of sortingBtns) {
          bt.classList.remove('arrow-up')
      }
      sortClients(clientsArray, 'ID', true)
      if (SortedUP) IDBtn.classList.toggle('arrow-up')
  })

  // сортировка по ФИО | навешивается на кнопку "Фамилия Имя Отчество"
  FIOBtn.addEventListener('click', () => {
   for (const bt of sortingBtns) {
       bt.classList.remove('arrow-up')
   }
   sortClients(clientsArray, 'FIO', false)
   if (SortedUP) FIOBtn.classList.toggle('arrow-up')
   })

   // сортировка по Дате создания | навешивается на кнопку "Дата и время создания"
   createdAtBtn.addEventListener('click', () => {
   for (const bt of sortingBtns) {
       bt.classList.remove('arrow-up')
   }
   sortClients(clientsArray, 'createdAt', true)
   if (SortedUP) createdAtBtn.classList.toggle('arrow-up')
   })

   // сортировка по Дате последнего изменения | навешивается на кнопку "Последние изменения"
   updatedAtBtn.addEventListener('click', () => {
   for (const bt of sortingBtns) {
       bt.classList.remove('arrow-up')
   }
   sortClients(clientsArray, 'updatedAt', true)
   if (SortedUP) updatedAtBtn.classList.toggle('arrow-up')
   })

   // обработчик события input | навешивается на поисковую строку
   searchInput.addEventListener('input', function(e) {
      let delay = 1000
      let timer
      clearTimeout(timer)

      timer = setTimeout(searchClients, delay, searchInput.value);
   })

}) ()

