function initial_editor(){
    var notes_number = 0, tags_number = 0, tags_for_filter = [];

    function edit_note_html(note_id, text){
        var edited_note = document.getElementsByClassName(note_id)[0].firstChild;
        edited_note.innerHTML = text;
    }

    function add_note_html(note_id, text){
        var note_div = document.createElement("div");
        note_div.className = note_id + " note_item";
        var text_div = document.createElement("div");
        text_div.className = "note_item_text";
        text_div.innerHTML = text;
        note_div.appendChild(text_div);
        var edit_btn = document.createElement("input");
        edit_btn.className = "btn btn_edit_note";
        edit_btn.setAttribute("type", "button");
        edit_btn.setAttribute("value", "Изменить");
        edit_btn.setAttribute("onclick", "editor.update_note('" + note_id + "', document.getElementsByClassName('" + note_id + "')[0].firstChild.innerHTML)");
        note_div.appendChild(edit_btn);
        var delete_btn = document.createElement("input");
        delete_btn.className = "btn btn_delete_note";
        delete_btn.setAttribute("value", "Удалить");
        delete_btn.setAttribute("type", "button");
        delete_btn.setAttribute("onclick", "editor.delete_note('" + note_id + "')");
        note_div.appendChild(delete_btn);
        document.getElementsByClassName("notes_storage")[0].insertBefore(note_div, document.getElementsByClassName("notes_storage")[0].firstChild);
    }

    function add_tag_html(tag_id, text, autofocus){
        var tag_div = document.createElement("div");
        tag_div.className = tag_id + " tag_item";
        var text_div = document.createElement("input");
        text_div.value = text;
        text_div.className = "tag_item_text";
        text_div.setAttribute("type", "text");
        text_div.setAttribute("size", "25");
        text_div.setAttribute("maxlength", "25");
        tag_div.appendChild(text_div);
        var delete_btn = document.createElement("input");
        delete_btn.className = "btn btn_delete_tag";
        delete_btn.setAttribute("value", "-");
        delete_btn.setAttribute("type", "button");
        delete_btn.setAttribute("onclick", "editor.delete_tag('" + tag_id + "')");
        tag_div.appendChild(delete_btn);
        document.getElementsByClassName("tags_storage")[0].insertBefore(tag_div, document.getElementsByClassName("tags_storage")[0].firstChild);
        var tag_text = document.getElementsByClassName(tag_id)[0].firstChild;
        if (autofocus){
            text_div.setAttribute("onfocusout", "editor.update_tag('" + tag_id + "', document.getElementsByClassName('" + tag_id + "')[0].firstChild.value)");
            tag_text.focus();
        } else {
            text_div.setAttribute("readonly", "readonly");
            text_div.setAttribute("onclick", "editor.add_tag_filter('" + tag_id + "', document.getElementsByClassName('" + tag_id + "')[0].firstChild.value)");
        }
    }

    function get_notes_number(){
        var notes_iterator = 0;
        for (var i=0; i < localStorage.length; i++){
            if (/^editor_note_[0-9]+$/.test(localStorage.key(i))){
                var note_id = localStorage.key(i).split(/editor_note_/)[1];
                if (parseInt(note_id) > notes_iterator) {
                    notes_iterator = parseInt(note_id);
                }
                add_note_html(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
            }
        }
        return notes_iterator;
    }

    function get_tags_number(){
        var tags_iterator = 0;
        for (var i=0; i < localStorage.length; i++){
            if (/^editor_tag_[0-9]+$/.test(localStorage.key(i))){
                var tag_id = localStorage.key(i).split(/editor_tag_/)[1];
                if (parseInt(tag_id) > tags_iterator) {
                    tags_iterator = parseInt(tag_id);
                }
                add_tag_html(localStorage.key(i), localStorage.getItem(localStorage.key(i)), false);
            }
        }
        return tags_iterator;
    }

    function color_tags(edit_area) {
        var text = edit_area.innerText;
        var regex = new RegExp("#[A-Za-z0-9_А-Яа-я]+", "g");
        text = text.replace(regex, function(str){
            return "<span class='tag_in_text'>" + str + "</span>";
        });
        return text;
    }

    function open_edit_window(note_text){
        var edit_layout = document.getElementsByClassName("edit_note_layout")[0];
        edit_layout.style.display = "block";
        var edit_area = document.getElementsByClassName("edit_note_area")[0];
        if (note_text){
            edit_area.innerHTML = note_text;
        } else {
            edit_area.innerHTML = "";
        }
        edit_area.innerHTML = color_tags(edit_area);
    }

    function save_new_tags(edit_area){
        var text = edit_area.innerText;
        var tags_for_check;
        var regex = new RegExp("#[A-Za-z0-9_А-Яа-я]+", "g");
        tags_for_check = text.match(regex) || [];
        for (var j = 0; j < tags_for_check.length; j ++) {
            var check_tag = true;
            for (var i = 0; i < localStorage.length; i++) {
                if (/^editor_tag_[0-9]+$/.test(localStorage.key(i))) {
                    if (localStorage.getItem(localStorage.key(i)) === tags_for_check[j]) {
                        check_tag = false;
                    }
                }
            }
            if (check_tag) {
                editor.create_tag(tags_for_check[j], false);
            }
        }
    }
    
    function close_edit_window(){
        var edit_layout = document.getElementsByClassName("edit_note_layout")[0];
        edit_layout.style.display = "none";
    }

    function filter_tags(tags) {
        document.getElementsByClassName("notes_storage")[0].innerHTML = "";
        if (tags.length === 0){
            for (var i = 0; i < localStorage.length; i ++){
                if (/^editor_note_[0-9]+$/.test(localStorage.key(i))){
                    add_note_html(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
                }
            }
        } else {
            for (var i = 0; i < localStorage.length; i ++){
                if (/^editor_note_[0-9]+$/.test(localStorage.key(i))){
                    var check_note = false;
                    for (var j = 0; j < tags.length; j ++){
                        if (/^#[A-Za-z0-9_А-Яа-я]+$/.test(tags[j][1])){
                            if (localStorage.getItem(localStorage.key(i)).search(tags[j][1]) !== -1){
                                check_note = true;
                            }
                        }
                    }
                    if (check_note){
                        add_note_html(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
                    }
                }
            }
        }
    }

    return {
        init: function (){
            notes_number = get_notes_number();
            tags_number = get_tags_number();
        },

        create_note: function (){
            open_edit_window();
            var save_btn = document.getElementsByClassName("btn_save_note")[0];
            save_btn.onclick = function(){
                editor.save_note(document.getElementsByClassName("edit_note_area")[0].textContent, document.getElementsByClassName("edit_note_area")[0].innerHTML);
                close_edit_window();
            }
        },

        update_note: function (note_id, note_text){
            open_edit_window(note_text);
            var save_btn = document.getElementsByClassName("btn_save_note")[0];
            save_btn.onclick = function(){
                editor.save_note(document.getElementsByClassName("edit_note_area")[0].textContent, document.getElementsByClassName("edit_note_area")[0].innerHTML, note_id);
                close_edit_window();
            }
        },

        delete_note: function (note){
            localStorage.removeItem(note);
            var deleted_note = document.getElementsByClassName(note)[0];
            deleted_note.remove();
        },

        create_tag: function (text, autofocus){
            tags_number ++;
            localStorage.setItem("editor_tag_" + tags_number, text || "#");
            if (autofocus === false){
                add_tag_html("editor_tag_" + tags_number, text || "#", autofocus);
            } else {
                add_tag_html("editor_tag_" + tags_number, text || "#", true);
            }

        },

        update_tag: function (tag, tag_text){
            localStorage.setItem(tag, tag_text);
            var tag_item = document.getElementsByClassName(tag)[0].firstChild;
            tag_item.setAttribute("readonly", "readonly");
            tag_item.setAttribute("onclick", "editor.add_tag_filter('" + tag + "', '" + tag_text + "')");
        },

        delete_tag: function (tag){
            localStorage.removeItem(tag);
            var deleted_tag = document.getElementsByClassName(tag)[0];
            deleted_tag.remove();
        },

        pass_tag_filter: function (tag, tag_text){
            document.getElementsByClassName(tag)[0].style.background = "#ffffff";
            document.getElementsByClassName(tag)[0].firstChild.style.background = "#ffffff";
            var new_array = [tag, tag_text];
            var tag_index = 0;
            for (var i = 0; i < tags_for_filter.length; i ++){
                if (tags_for_filter[i][0] === new_array[0] && tags_for_filter[i][1] === new_array[1]){
                    tag_index = i;
                }
            }
            tags_for_filter.splice(tag_index, 1);
            var tag_item = document.getElementsByClassName(tag)[0].firstChild;
            tag_item.setAttribute("onclick", "editor.add_tag_filter('" + tag + "', '" + tag_text + "')");
            filter_tags(tags_for_filter);
        },

        add_tag_filter: function (tag, tag_text){
            document.getElementsByClassName(tag)[0].style.background = "#eeeeee";
            document.getElementsByClassName(tag)[0].firstChild.style.background = "#eeeeee";
            var new_array = [tag, tag_text];
            tags_for_filter.splice(1, 0, new_array);
            var tag_item = document.getElementsByClassName(tag)[0].firstChild;
            tag_item.setAttribute("onclick", "editor.pass_tag_filter('" + tag + "', '" + tag_text + "')");
            filter_tags(tags_for_filter);
        },

        pass_saving: function (){
            close_edit_window();
        },

        save_note: function (note_text, note_html, note){
            if (note){
                localStorage.setItem(note, note_text);
                edit_note_html(note, note_html);
            } else {
                notes_number ++;
                localStorage.setItem("editor_note_" + notes_number, note_text);
                add_note_html("editor_note_" + notes_number, note_html);
            }
            save_new_tags(document.getElementsByClassName('edit_note_area')[0]);
        }
    }
}

var editor = initial_editor();
editor.init();