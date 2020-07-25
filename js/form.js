'use strict';
(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var capacitySelect = document.querySelector('#capacity');
  var roomSelect = document.querySelector('#room_number');
  var offerTitle = document.querySelector('#title');
  var priceInput = document.querySelector('#price');
  var typeSelect = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var addressInput = document.querySelector('#address');
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');

  var toggleStateOfForm = function (elements, isActive) {
    if (isActive) {
      elements.forEach(function (element) {
        element.disabled = false;
      });
    } else {
      elements.forEach(function (element) {
        element.disabled = true;
      });
    }
  };

  var setInactiveAddress = function () {
    var CoordinateX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
    var CoordinateY = Math.round(mainPin.offsetTop + mainPin.offsetHeight / 2);
    addressInput.value = CoordinateX + ', ' + CoordinateY;
  };

  var setActiveAddress = function () {
    var CoordinateX = Math.round(mainPin.offsetLeft + mainPin.offsetWidth / 2);
    var CoordinateY = Math.round(mainPin.offsetTop + window.constants.mainActivePinHeight);
    addressInput.value = CoordinateX + ', ' + CoordinateY;
  };

  var onSelectRoomCapacity = function () {
    switch (true) {
      case (roomSelect.value === '100' && capacitySelect.value !== '0'):
        roomSelect.setCustomValidity('Для выбранного количества комнат размещение гостей невозможно');
        break;

      case (roomSelect.value !== '100' && capacitySelect.value === '0'):
        capacitySelect.setCustomValidity('Выберите количество гостей');
        break;

      case (capacitySelect.value > roomSelect.value && capacitySelect.value !== '0'):
        roomSelect.setCustomValidity('Количество комнат не должно быть меньше количества гостей');
        break;

      default:
        roomSelect.setCustomValidity('');
        capacitySelect.setCustomValidity('');
        break;
    }
  };

  var onSuccessMessageEscPress = function (evt) {
    if (evt.key === 'Escape') {
      removeSuccessMessage();
    }
  };

  var onWindowSuccessMessageClick = function (evt) {
    if (evt.target.matches('.success')) {
      removeSuccessMessage();
    }
  };

  var removeSuccessMessage = function () {
    document.querySelector('.success').remove();
  };

  var onSuccessMessage = function () {
    var successfullMessage = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
    document.querySelector('main').appendChild(successfullMessage);
    document.addEventListener('keydown', onSuccessMessageEscPress);
    document.addEventListener('click', onWindowSuccessMessageClick);
  };

  var removeUnsuccessfullMessage = function () {
    document.querySelector('.error').remove();
  };

  var onErrorButtonClick = function () {
    removeUnsuccessfullMessage();
  };

  var onUnSuccessfullMessageEscPress = function (evt) {
    if (evt.key === 'Escape') {
      removeUnsuccessfullMessage();
    }
  };

  var onWindowUnsuccessfullMessageClick = function (evt) {
    if (evt.target.matches('.error')) {
      removeUnsuccessfullMessage();
    }
  };

  var onUnsuccessfullMessage = function (errorMessage) {
    var unSuccessfullMessage = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var messageText = unSuccessfullMessage.querySelector('.error__message');
    messageText.textContent = errorMessage;

    document.querySelector('main').appendChild(unSuccessfullMessage);

    var errorButton = unSuccessfullMessage.querySelector('.error__button');
    errorButton.addEventListener('click', onErrorButtonClick);
    document.addEventListener('keydown', onUnSuccessfullMessageEscPress);
    document.addEventListener('click', onWindowUnsuccessfullMessageClick);
  };

  var onSubmit = function (evt) {
    window.backend.upload(new FormData(adForm), onSuccessMessage, onUnsuccessfullMessage);
    window.map.disableMap();
    evt.preventDefault();
  };

  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    window.map.disableMap();
  };

  adForm.addEventListener('submit', onSubmit);
  resetButton.addEventListener('click', onResetButtonClick);

  offerTitle.addEventListener('input', function () {
    switch (true) {
      case offerTitle.validity.tooShort:
        offerTitle.setCustomValidity('Заголовок объявления должен состоять минимум из 30-ти символов');
        break;
      case offerTitle.validity.tooLong:
        offerTitle.setCustomValidity('Заголовок объявления не должен превышать 100 символов');
        break;
      case offerTitle.validity.valueMissing:
        offerTitle.setCustomValidity('Обязательное поле');
        break;
      default:
        offerTitle.setCustomValidity('');
        break;
    }
  });

  typeSelect.addEventListener('change', function () {
    switch (typeSelect.value) {
      case 'bungalo':
        priceInput.minValue = 0;
        priceInput.placeholder = '0';
        break;
      case 'flat':
        priceInput.minValue = 1000;
        priceInput.placeholder = '1000';
        break;
      case 'house':
        priceInput.minValue = 5000;
        priceInput.placeholder = '5000';
        break;
      case 'palace':
        priceInput.minValue = 10000;
        priceInput.placeholder = '10000';
        break;
    }
  });

  priceInput.addEventListener('input', function () {
    switch (true) {
      case priceInput.value < priceInput.minValue:
        priceInput.setCustomValidity('Цена за ночь не может быть меньше ' + priceInput.minValue);
        break;
      case priceInput.validity.valueMissing:
        priceInput.setCustomValidity('Введите цену жилья за ночь');
        break;
      default:
        priceInput.setCustomValidity('');
        break;
    }
  });

  timeIn.addEventListener('change', function () {
    switch (timeIn.value) {
      case '12:00':
        timeOut.selectedIndex = 0;
        break;
      case '13:00':
        timeOut.selectedIndex = 1;
        break;
      case '14:00':
        timeOut.selectedIndex = 2;
        break;
    }
  });

  timeOut.addEventListener('change', function () {
    switch (timeOut.value) {
      case '12:00':
        timeIn.selectedIndex = 0;
        break;
      case '13:00':
        timeIn.selectedIndex = 1;
        break;
      case '14:00':
        timeIn.selectedIndex = 2;
        break;
    }
  });

  roomSelect.addEventListener('input', onSelectRoomCapacity);

  capacitySelect.addEventListener('input', onSelectRoomCapacity);

  window.form = {
    toggleStateOfForm: toggleStateOfForm,
    setInactiveAddress: setInactiveAddress,
    setActiveAddress: setActiveAddress
  };
})();
