// static/js/avatar_crop.js
document.addEventListener("DOMContentLoaded", () => {
  const fileInput    = document.getElementById("id_avatar");
  const previewBlock = document.getElementById("avatarPreviewBlock");
  const previewImg   = document.getElementById("avatarPreview");
  const modal        = document.getElementById("cropperModal");
  const cropperImage = document.getElementById("cropperImage");
  const btnConfirm   = document.getElementById("cropConfirm");
  const btnCancel    = document.getElementById("cropCancel");
  const removeFlag   = document.getElementById("remove_avatar"); // есть только в edit_profile

  if (!fileInput || !previewImg || !modal) return;

  let cropper = null;

  // если нет аватара — скрываем превью
  if (!previewImg.getAttribute("src")) {
    previewBlock.style.display = "none";
  } else {
    previewBlock.style.display = "flex";
  }

  function openModalWith(src) {
    cropperImage.src = src;
    modal.classList.remove("hidden");
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
    cropperImage.onload = () => {
      if (cropper) cropper.destroy();
      cropper = new Cropper(cropperImage, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        autoCropArea: 1,
        movable: true,
        zoomable: true,
        ready() {
          // Делаем рамку круглой
          const cropBox = modal.querySelector('.cropper-view-box');
          const face = modal.querySelector('.cropper-face');
          if (cropBox) cropBox.style.borderRadius = '50%';
          if (face) face.style.borderRadius = '50%';
        }
      });
    };
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
    if (cropper) { cropper.destroy(); cropper = null; }
    cropperImage.src = "";
  }

  fileInput.addEventListener("change", e => {
    const [file] = e.target.files || [];
    if (!file) return;
    if (removeFlag) removeFlag.value = "0"; // сбросить флаг удаления
    const url = URL.createObjectURL(file);
    openModalWith(url);
  });

  btnCancel.addEventListener("click", closeModal);

  btnConfirm.addEventListener("click", () => {
    if (!cropper) return closeModal();
    const canvas = cropper.getCroppedCanvas({ width: 320, height: 320 });
    if (!canvas) return closeModal();

    previewBlock.style.display = "flex";
    previewImg.src = canvas.toDataURL("image/png");

    canvas.toBlob(blob => {
      const file = new File([blob], "avatar.png", { type: "image/png" });
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      closeModal();
    }, "image/png", 0.92);
  });
});
