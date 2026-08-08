(function ($) {
  function openMedia(productId, $card) {
    const frame = wp.media({
      title: sohatebImages.i18n.title,
      button: { text: sohatebImages.i18n.button },
      multiple: false,
      library: { type: "image" },
    });

    frame.on("select", function () {
      const attachment = frame.state().get("selection").first().toJSON();
      const $status = $card.find(".st-img-card__status");
      $status.removeClass("is-ok is-err").text("...");

      $.post(sohatebImages.ajaxUrl, {
        action: "sohateb_set_product_image",
        nonce: sohatebImages.nonce,
        product_id: productId,
        image_id: attachment.id,
      })
        .done(function (res) {
          if (!res || !res.success) {
            $status.addClass("is-err").text(sohatebImages.i18n.error);
            return;
          }
          const data = res.data || {};
          if (data.thumb) {
            $card.find(".st-img-card__thumb").attr("src", data.thumb);
          }
          if (data.editUrl) {
            $card
              .find(".st-img-card__crop")
              .attr("href", data.editUrl)
              .removeClass("disabled")
              .removeAttr("aria-disabled tabindex");
          }
          $status.addClass("is-ok").text(data.message || sohatebImages.i18n.saved);
        })
        .fail(function () {
          $status.addClass("is-err").text(sohatebImages.i18n.error);
        });
    });

    frame.open();
  }

  $(document).on("click", ".st-img-card__change", function (e) {
    e.preventDefault();
    const productId = $(this).data("product-id");
    const $card = $(this).closest(".st-img-card");
    openMedia(productId, $card);
  });
})(jQuery);