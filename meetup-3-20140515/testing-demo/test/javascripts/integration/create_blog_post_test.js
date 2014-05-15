module("Create a blog post", {
  teardown: function() {
    // Clear all mocked AJAX endpoints.
    $.mockjaxClear();

    TestingDemo.reset();
  }
});

var title = "This is a title";
var content = "This is content";

test("No title given", function() {
  expect(2);

  visit('/');

  fillIn('.title', "");
  fillIn('.content', content);
  click('.submit');

  andThen(function() {
    equal(find('.error').length, 1, "Shows one error message");
    equal(find('.error').text(), "Please give a title", "Shows the right error message");
  });
});

test("No content given", function() {
  expect(2);

  visit('/');

  fillIn('.title', title);
  fillIn('.content', "");
  click('.submit');

  andThen(function() {
    equal(find('.error').length, 1, "Shows one error message");
    equal(find('.error').text(), "Please give a content", "Shows the right error message");
  });
});

test("Valid title and content", function() {
  expect(4);

  visit('/');

  fillIn('.title', title);
  fillIn('.content', content);
  click('.submit');

  andThen(function() {
    equal(find('.error').length, 0, "Shows no error message");

    // We transitioned routes
    equal(currentRouteName(), "blogPosts.show", "We transitioned to the 'show' route");
    // Shows the blog post data
    equal(find(".title").text(), title, "Shows the title of the blog post");
    equal(find(".content").text(), content, "Shows the content of the blog post");
  });
});

test("It hits the API", function() {
  expect(3);

  visit('/');

  // Mock the POST request
  $.mockjax({
    type: "POST",
    url: "/blog_posts",
  });

  fillIn('.title', title);
  fillIn('.content', content);
  click('.submit');

  andThen(function() {
    var requests = $.mockjax.mockedAjaxCalls();

    equal(requests.length, 1, "One request was made");

    // Parameters
    var blog_post = JSON.parse(requests[0].data).blog_post;
    equal(blog_post.title, title, "The correct title is sent");
    equal(blog_post.content, content, "The correct content is sent");
  });
});
