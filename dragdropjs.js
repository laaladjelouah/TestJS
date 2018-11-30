$(document).ready(function () {
    var filename = "";
    var fileformatError = "Le format de votre pièce jointe doit être un des formats listés: .jpg, .bmp, .png, .tif, .pdf, .doc, .gif, .docx ";
    var maxfiletError = "Le nombre de pièces jointes est limité à 5";
    var filesizeError = "La taille de la pièce jointe ne doit pas excéder 4 Mo ";
    var dropZone = document.getElementById('dragOverlay');
    var dropZoneTitle = document.getElementById('dragTitle');
    var dropZoneSubTitle = document.getElementById('dragSubTitle');
    var filesStream = Array();
    var filesInfo = Array();
    var maxSize = 4194304; // 4Mo

    function showDropZone() {
        dropZone.style.display = "block";
        dropZoneTitle.style.display = "inline-block";
        dropZoneSubTitle.style.display = "inline-block";
        $('body').addClass('dragenter');
        $('.close').css('z-index', '300');
        $("body.dragenter #dragMessage").css("display", "flex");
        $("#dragMessage").css("display", "flex");
    }

    function hideDropZone() {
        dropZone.style.display = "none";
        dropZoneTitle.style.display = "none";
        dropZoneSubTitle.style.display = "none";
        $('.close').css('z-index', '304');
        $('body').removeClass('dragenter');
        $("body.dragenter #dragMessage").css("display", "none");
        $("#dragMessage").css("display", "none");
    }

    function allowDrag(e) {
        if (true) {
            e.dataTransfer.dropEffect = 'copy';
            e.preventDefault();
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        hideDropZone();
        if ($('.img-wrap').length < 5) {
            CreateThumbnails(e.dataTransfer.files);
        } else {
            $('#errorLabel').text(maxfiletError);
            $('.attachmentsDiv').css('margin-top', '0');
        }
    }
    window.addEventListener('dragenter', function (e) {
        showDropZone();
    });

    dropZone.addEventListener('dragenter', allowDrag);
    dropZone.addEventListener('dragover', allowDrag);
    dropZone.addEventListener('dragleave', function (e) {
        hideDropZone();
    });
    dropZone.addEventListener('drop', handleDrop);

    function CreateThumbnails(files) {
        var f = files[0];
        if (!validateFormat(f) || !validateSize(f)) {
            return false;
        } else {
            $('#errorLabel').text("");
            var reader = new FileReader();
            $('.attachmentsDiv').css('margin-top', '40');
            $('#thumbnails').css('margin-top', '20');
            reader.onload = handleReaderLoad;
            reader.readAsDataURL(f);
        }
    }

    function validateFormat(file) {
        if (!file || !file.type.match(/image\/jpeg|image\/jpg|image\/tiff|image\/png|image\/gif|image\/bmp|image\/png|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/msword|application\/pdf/)) {
            {
                $('#errorLabel').text(fileformatError);
                $('.attachmentsDiv').css('margin-top', '0');
                filesInfo.pop();
                return false;
            }
        } else if (file.type.match(/application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/msword|application\/pdf/)) {
            filename = file.name.replace(/[^a-z0-9\-_.]/gi, '_');
            if (filename.length >= 15) { filename = filename.substr(0, 10) + "..."; }
            filesInfo.push(file);
            return true;
        } else {
            filesInfo.push(file);
            return true;
        }
    }

    function validateSize(file) {

        if (!file || file.size > maxSize) {
            $('#errorLabel').text(filesizeError);
            $('.attachmentsDiv').css('margin-top', '0');
            return false;
        }
        return true;
    }

    function handleReaderLoad(evt) {
        var b64 = evt.target.result;
        var mimetype = b64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
        filesStream.push(b64);
        switch (mimetype) {
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            case "application/msword":
                b64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABkCAYAAAA7Ska5AAAFjUlEQVR4nO2cbWgcRRiAn00DlQa8UsjHD2lSQSkJURFUiqVFpRBt6w8rBYugkFIqtaFK8UciGJWkUIuhUcEWgxixQlAUi1goKIlKbUFa7VdQsI0GYnLUNpG2pJIbf8wme5u7ye3tzd5s7uaB5T723ZnZ5+Zrd28XIQTzFxexCJfX0EWJidEnpwTF6JETUEyciUZOCYspTE6JielEl5wSEwO65JSgGNAhp0TFQKFySlgMFCKnxMVAWDllIAbCyCkTMZCvnDISA/nIKTMxEFROGYqBIHLKVAzkklPGYmABOU5Tx0zWLc53LZnLqKljxgmRqVbOdy1RrUoXEqacnWT2MZ2VKEzPE2ay1nwDPBEwVlc5Oys0JRQV/wEvm8g47mLeAYZNZFxpItOAJIE3A8Tp7P/mmmKca0w7cM1U5nEVcwb40GQBlE2puQZ6n/N7Ozci6Ppa8Pf1zPjuzQ5rVstafWlc0HNMcHbCH1NXBW2PenEnhgW932akJ4A2IPs8okgs2MdUJ/yfH7nH4c46h429Kd/3AzscGlc6ads59NY6tH2U8snpa62gvsb7/ORDDveuykjvM+D7PPdDOzmbUnISnulNseuDFMlJqK+B9g2ehBfXelLePybo+EQwMiGlvtTij6uvgRvTsP8LGZechF8u+aYeN4C9unauEAKNSrO/+ucnBDtbHO5b5a1b1yhfjwwK3v1B7uS1m4L3tlfw4N0OdVWyqczGffmToP9nGffHlYzmdgD4M/zu6COvzvfsqNyh6oRXExpq5fsff/d++cHLsmYAVFep4+b3QcCRfMoTJaFGparbdBdjjo7IUs6TvMQ03yF/9cvj3q8++/7hu7xatL4Bli2VtSZ5XR3XnNYRuzwLPJBPmaIiUB/TXAMrlsGWNXKnhi5464YuQONK2LbeYeom/HUF9myScedGvKE4PQ5g6qZM79yIYPfAnGgHeBtYh+HTHTnFVCfg0zavYo1MMNfJgny/rhEaVzrsTBuFkpPQc8wf9/j9cmSalQNQuzwjy7XAFuSwbYwFm1Jy0r9896ugtS+VEbf1sOCrk2Iu7tRvImMOA9Dal/LFHRkUbD2ctWLsB5aG363CcZo6ZuJ6hu4V4K3ZDwucqNLJojiIfBWoNpV5nMXcDrxhKvM4iwHYDjSZyDjuYiqRhwlGMs56BixuVwmKjZN2Hcn70nGg8MsSi5FFMSoZxYpRoFvMJmCUzMueppZRYGOYHdHdx4wDmcfMZkkSvEyR9TEl00nrFrMbGNOcZiGMAbvCbGiHaz92uM6FFaPAilFgxSjQLeYp7AQvKxMYPOumYAKoDRhbVqNSqKmGneApsBM8P2XVlEKh9c+Jqj9TmyTs9ShbYxSYFJMg3NwkkS0x3dgao8CKUWDFKLBiFFgxCqwYBVaMAitGgRWjwIpRYMUosGIUWDEKrBgFQU9tamfJ0gSr9/6T93bDB1YwMz0ZQYn82BqjwIpRsFBTyps8z/kmCHdf9XIgcFvSes4326NTgixxJOy+2KakwIpRYMUoiOppIK8jb/xciLA/yhkg8zY7Px8jnyQUmijF1AE7Iki7Icf6Q2i4zymqppQCdgIHI0pfxUHgBXLXqJxE2ccIYA+wL8I80tnn5qdl3lCMzred6O/A73Dz0UaxRqVu5EO4dM8ChZtut+Z0izpc9yDbvy45wk2vR1N6Poo9jzkEPE/hTxOacdM5VGA6SkxM8PqBbcCtkNvfcrfv11aiLJia+Q4ATwPTeW437W43oL1E8zB5SHAU2Ix8/FIQbrjxRyMrURqmj5WOAy3AVI64f92445GXyMW0GJBPMNsAXFWsv+quL+qTzuIgBuAU8Bjy/sV0ku73J4tdoLiIATgNrMf7Z/mY+/m0icLESQzAReRjmIbc14umCvI/h1pNqlbef4AAAAAASUVORK5CYII='; //doc picto
                break;
            case 'application/pdf':
                b64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABkCAYAAAA7Ska5AAAExUlEQVR4nO2cTWgcVRzAf2N7KtS0uE09qdeNhyrJSW09iFC/LuqhiIoHIyuilShCW8Go0ILWlNRL40WI4KEIPeTgoTlpFdSU5NR4bKUQTCL9EBZaScfDm3S/5j8fb9/bN5l5P1g2s/Of99788r52ZucRhiHdr4hwC74+wRQlE2NOTgnFmJGTUUyRsSOnxGL6k1MyMZOYklMyMWBKTgnFgAk5JRUD/copsRjoR07JxYCunAqIAR05FREDeeVUSAzkkVMxMZBVTgXFQBY5FRUDaXIqLAYS5ATh6FjsEcHFhZah0bFAI1OjBBcXpF3tQnTKOUlvHzMZhKNjRa8RPwLPZhRjjHtsJGqQ/4AJFxkXXczXwJ8uMt7uItOMrAGfZ4gz2f/dbZZFrjFHgeuuMi+qmCXgW5cFkJvSSB2mpjo/m5+Hk18lx1y+DKdPw6Xl5DiAc+dg5pvuT0PgPWAjvfj2SO5jarXO7UOH1Hu7nO6YWg3OnIFGo1NOdxzAzp1xuf4A/JxYrgGQ3vmur8PEBOzfD+PjsG+fHLN7N0x8AA8+AEeOwGuvx8fd3f6nO6Um8GHek7BBtlHp0rI6ifFx2LNHjtlkehrqdRgehtVVOa6Xk8BfmcpkmfzD9Y4dyft/+RWaTRVXu69XzEi99XevpO9zl8cS2cSM1FVTArhyRT+3Wg1mZ1vbhw8rkS2OAV3tzw3pYrpP5sKF5PjHH2vVqt4+RPUzMq+iZrt/pJbLMtlqzObJzM/HDa+KzSbSaKj3hYXeZrS+DgefScopAKaAAzi+3JFtVEo+md5a1WyquYweTwAvoYZtZySLSa728TFxE7ysabX4ApgDbuU5yCRFvh7zEfDl5kbC9RiTbIkvkR8DwqTJPkUWcy/wmavMiywG4E3gYRcZF13MdtTXBCcZx14BK9pdgkETtN1Han0YBND/bYmtyJYYlZzixQiYFvM8cJXe256uXleB53ROxHQf8zcwrFMQi6yRvUzW+pjSdNKmxbwLrBhOsx9WgHd0DvTDdSd+uE7DixHwYgS8GAHTYl7ET/BiWcXhVTeBVWBvxthKjUpaUw0/wRPwE7xOKtWUtDD640Tpx9Qu0b0f5WuMgEsxQ+jNTYYGUThfYwS8GAEvRsCLEfBiBLwYAS9GwIsR8GIEvBgBL0bAixHwYgS8GIGslzaNM7RtG9cfeTT3cbuWFrmxYf+pQF9jBLwYgaSmlJuc13yH0HuuehdwI2uw0Wu+cUunZHkVEd1z8U1JwIsR8GIEbK0G8inqwc8kdP8pS8CdlJjvUCsJaWNTzP3AWxbSfihl/wwGnnOy1ZTuAA1g2lL6EtPA26TXqFRs9jEh8D5wwmIe7ZyI8jMybxhE53sU9QS+TY5F+RhjUKPScdQiXKZngWGU7nHD6Q50uD6Fav+m5IRReqcMpdfBoOcxM8Ab9L+a0EaUzkyf6Yi4mODNAq8AtzWPvx0dP5sW2A+uZr5ngZfJv0TBrei4s8ZL1IXLrwRzwAuo5Zey0Izi56yVqA3X35XOAweBmylx/0Zx562XKMK1GFArmD0NXBP2X4v2D3SlsyKIAfgdeAr1/GI7a9Hnvw26QEURA7AIPEnrl+Ur0faii8IUSQzAMmoZpp+i98S14WzyP1tp6GinG95vAAAAAElFTkSuQmCC'; // pdf picto
                break;
        }

        var img = $('<img />', {
            src: b64,
            'data-id': Math.random()
        });
        if (filename != "") {
            filename = "<div class='bottomLabel'>" + filename + "</div>"
        }
        var attachedFile = "<div class='img-wrap'><span class='close'>&times;</span>" + img[0].outerHTML + filename + "</div>";
        $("#thumbnails").append(attachedFile);
        filename = "";
        $('#cphMainArea_Attachments').val(getAttachments());
    }

    $(document).on("click", ".img-wrap .close", function () {
        var src = $(this).closest('.img-wrap').find('img').src;
        $(this).closest('.img-wrap').remove();
        if ($('.img-wrap').length == 0) {
            $('.attachmentsDiv').css('margin-top', '0');
        }
        deleteFile()
    });

    $("input[id='inputFile']").on("change", function (event) {

        if ($('.img-wrap').length < 5) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i += 1) {
                var file = files[i];
                file.name = file.name.replace(/[^a-z0-9\-_.]/gi, '_');
                CreateThumbnails(files);
            }
        } else {
            $('#errorLabel').text(maxfiletError);
            $('.attachmentsDiv').css('margin-top', '0');
        }
        //select the same file twice..or more
        this.value = null;
    });

    function deleteFile(filebin) {
        for (i = 0; i < filesInfo.length; ++i) {
            if (filesInfo[i].AttachmentStream == filebin) {
                filesInfo.splice(i, 1);
                filesStream.splice(i, 1);
            }
        }
        $('#cphMainArea_Attachments').val(getAttachments());
    }

    function getAttachments() {
        var jsonArr = [];
        for (var i = 0; i < filesInfo.length; i++) {
            jsonArr.push({
                AttachmentType: filesInfo[i].type,
                AttachmentName: filesInfo[i].name,
                AttachmentStream: filesStream[i]
            });
        }
        return JSON.stringify(jsonArr);
    }
    $('textarea').on("input", function () {
        var maxlength = $(this).attr("maxlength");
        var currentLength = $(this).val().length;
        if (currentLength >= maxlength) {
            $('#charlef').removeClass('charlef');
            $('#charlef').addClass('nocharlef');
            $('#charlef').html("0 caractères restants <strong>!</strong>");
        } else {

            $('#charlef').addClass('charlef');
            $('#charlef').removeClass('nocharlef');
            $('#charlef').html((maxlength - currentLength + " caractères restants <strong>✓</strong>"));
        }
        if (currentLength == 0) {
            $('#charlef').removeClass('charlef');
            $('#charlef').removeClass('nocharlef');
            $('#charlef').html((maxlength + " caractères restants"));
        }
    });

    //Popup
    //Pourquoi faire simple ? la popup s'affiche normalement sur PC,
    //MAIS elle doit glisser du bas vers le haut sur smartphone.... -_-'
    $('#cphMainArea_sendBtn_faq').click(function () {
        var $window = $(window);
        var windowsize = $window.width();
        if (windowsize <= 630) {
            $('#poverlay').fadeIn(300);
            $('#popupf').animate({
                bottom: 0
            }, 300);
            $('#closepf').click(function () {
                $('#poverlay').fadeOut(100);
                $('#popupf').animate({
                    bottom: -300
                });
            });
        } else {
            $('#poverlay').fadeIn(300);
            $('#closepf').click(function () {
                $('#poverlay').fadeOut(100);
            });
        }
    });
    // Lire la suite - Réduire
    var showChar = 360;
    var ellipsestext = "...";
    var moretext = "Lire la suite";
    var lesstext = "Réduire";

    $('.readmore').each(function () {
        var content = $(this).html();
        if (content.length > showChar) {
            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);
            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
            $(this).html(html);
        }
    });

    $(".morelink").click(function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});
